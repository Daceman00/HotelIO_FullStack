import React from "react";

function LatestBookings() {
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-amber-600 bg-amber-100";
      case "Canceled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">See all</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Products</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={order.image || "/placeholder.svg"}
                          alt={order.product}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.product}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.variants}{" "}
                          {order.variants === 1 ? "Variant" : "Variants"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium">
                    ${order.price.toFixed(2)}
                  </td>
                  <td className="py-4 text-gray-600">{order.category}</td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LatestBookings;
