const catchAsync = require('../utils/catchAsync')
const User = require('./../models/userModel')
const CRM = require('./../models/crmModel');
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const sendEmail = require('./../utils/email');
const crypto = require('crypto')
const { promisify } = require('util');
const { getReferralNotificationEmail } = require('../utils/signupReferralNotificationEmail');
const { emitUserActivity, sendUserNotification } = require("../utils/socket-setup")

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res, warning = null) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  const response = {
    status: 'success',
    token,
    data: {
      user
    }
  };

  // Add warning if provided
  if (warning) {
    response.warning = warning;
  }

  res.status(statusCode).json(response);

}

exports.signup = catchAsync(async (req, res, next) => {

  try {
    // Extract referral code from request body
    const { referralCode } = req.body;

    // Create a new user instance to validate
    const user = new User(req.body);

    // Validate the user data
    await user.validate();

    // Save the user
    const newUser = await user.save();

    // Handle referral if code was provided
    let warning = null;
    let referrerUser = null; // Store referrer user info for email

    if (referralCode) {
      // Find the referrer's CRM by their referral code
      const referrerCRM = await CRM.findOne({ referralCode: referralCode });

      if (referrerCRM) {
        // Get the newly created CRM for this user
        const newUserCRM = await CRM.findOne({ user: newUser._id });

        referrerUser = await User.findById(referrerCRM.user)

        // Link the new user to their referrer
        newUserCRM.referredBy = referrerCRM.user;
        await newUserCRM.save();

        // Update referrer's stats and give bonus
        referrerCRM.referralsMade += 1;
        await referrerCRM.addPoints(100, 'referral', 'Referral bonus - new signup');
        await referrerCRM.save();

        // ✅ Send email notification to referrer
        if (referrerUser && referrerUser.email) {
          try {
            const emailTemplate = getReferralNotificationEmail(newUser);

            await sendEmail({
              email: referrerUser.email,
              subject: emailTemplate.subject,
              message: emailTemplate.text,
              html: emailTemplate.html
            });

            console.log(`✅ Referral notification email sent to ${referrerUser.email}`);
          } catch (emailError) {
            console.error('❌ Failed to send referral notification email:', emailError);
            // Don't throw error here - email failure shouldn't break signup
          }
        }

      } else {
        // Referral code was provided but doesn't exist
        warning = 'The referral code you entered is invalid. Your account has been created successfully, but the referral was not applied.';
        console.log(warning)
      }
    }

    emitUserActivity("signup", newUser)

    await sendUserNotification(newUser.id, {
      type: 'signup',
      title: 'Welcome to HotelIO!',
      message: 'Your account has been created successfully.',
      data: {
        userId: newUser._id
      },
      link: `/updateAccount`
    })

    await sendUserNotification(referrerUser.id, {
      type: 'referral',
      title: 'You have a new referral!',
      message: 'A new user has signed up using your referral code.',
      data: {
        userId: newUser._id
      },
      link: `/updateAccount`
    })

    createSendToken(newUser, 201, res, warning)
  } catch (error) {
    throw error; // Re-throw to let catchAsync handle it
  }
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  const user = await User.findOne({ email, active: true }).select("+password")

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  emitUserActivity("login", user)

  createSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check if it's there
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401))
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does not exist', 401))
  }

  // Chacek is user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    {
      return next(new AppError('User recently changed password! Please log in again', 401))
    }
  }

  // Grant access to protected routes
  req.user = currentUser;

  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });
  // Check is that user exists
  if (!user) return next(new AppError('There is no user with that email address', 404));

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false })

  // Send email with token
  const resetURL = `https://hoteliodario.netlify.app/resetPassword/${resetToken}`;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'DM Sans',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <div style="display:inline-block;border:1px solid #c9a96e;padding:10px 28px;">
                <span style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#c9a96e;letter-spacing:6px;text-transform:uppercase;">HotelIO</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:linear-gradient(145deg,#161616,#111111);border:1px solid #222;border-radius:2px;overflow:hidden;">

              <!-- Gold top bar -->
              <div style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);"></div>

              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Icon area -->
                <tr>
                  <td align="center" style="padding:52px 48px 32px;">
                    <div style="width:72px;height:72px;border:1px solid #c9a96e33;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#c9a96e11;">
                      <span style="font-size:28px;">🔑</span>
                    </div>
                  </td>
                </tr>

                <!-- Title -->
                <tr>
                  <td align="center" style="padding:0 48px 16px;">
                    <h1 style="margin:0;font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;color:#f5f0e8;letter-spacing:2px;line-height:1.2;">
                      Password Reset
                    </h1>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="width:48px;height:1px;background:#c9a96e;display:inline-block;"></div>
                  </td>
                </tr>

                <!-- Body text -->
                <tr>
                  <td style="padding:0 48px 36px;">
                    <p style="margin:0 0 16px;font-size:15px;font-weight:300;color:#999;line-height:1.8;text-align:center;letter-spacing:0.3px;">
                      We received a request to reset the password for your HotelIO account.
                      Click the button below to choose a new password.
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding:0 48px 48px;">
                    <a href="${resetURL}"
                      style="display:inline-block;background:transparent;border:1px solid #c9a96e;color:#c9a96e;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:4px;text-transform:uppercase;text-decoration:none;padding:16px 48px;">
                      Reset My Password
                    </a>
                    <p style="margin:24px 0 0;font-size:12px;color:#555;letter-spacing:0.3px;">
                      This link expires in <span style="color:#c9a96e;">10 minutes</span>
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 48px;">
                    <div style="height:1px;background:#1e1e1e;"></div>
                  </td>
                </tr>

                <!-- Security note -->
                <tr>
                  <td style="padding:28px 48px 40px;">
                    <p style="margin:0;font-size:12px;color:#444;line-height:1.8;text-align:center;letter-spacing:0.3px;">
                      If you didn't request this, you can safely ignore this email.<br/>
                      Your password will remain unchanged.
                    </p>
                  </td>
                </tr>

              </table>

              <!-- Gold bottom bar -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,#c9a96e44,transparent);"></div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 0 0;">
              <p style="margin:0;font-size:11px;color:#333;letter-spacing:2px;text-transform:uppercase;">
                © 2025 HotelIO · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

  const message = `You requested a password reset. Visit this link to reset your password: ${resetURL}. If you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is valid for 10 minutes',
      message: message,
      html: html
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    })

  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false })

    return next(new AppError('There was an error sending email. Try again!', 500))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const rawToken = req.params.token;
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  // Debug info – remove when done
  const userByHashed = await User.findOne({ passwordResetToken: hashedToken });
  const userByRaw = await User.findOne({ passwordResetToken: rawToken });

  console.log({
    rawToken,
    hashedToken,
    userByHashed: !!userByHashed,
    userByRaw: !!userByRaw,
  });

  // Original logic (uses hashed token + expiry)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect", 401))
  }

  // If it is true , update the password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  //Log in user
  createSendToken(user, 200, res)

})

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};