const FeatureItem = ({ icon, title, children }) => (
  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex items-center justify-center w-10 h-10 bg-[#dfa974]/10 rounded-lg">
      <i className={`fas fa-${icon} text-[#dfa974] text-lg`} />
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
      <div className="text-gray-900">{children}</div>
    </div>
  </div>
);

export default FeatureItem;
