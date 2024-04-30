import React from "react";
import { Link } from "react-router-dom";

const AdminMenu: React.FC = () => {
  return (
    <>
    <div className="text-center" >
      <div className="list-group dashboard-menu shadow-lg">
        <h6 className="text-orange" style={{fontSize: "20px"}}>Admin Panel</h6>
        {/* <Link
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action text-orange" style={{borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}>
          Create Category
        </Link> */}
        <Link
          to="/addproducts"
          className="list-group-item list-group-item-action" style={{borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}>
          Create Product
        </Link>
        <Link
          to="/updateproducts"
          className="list-group-item list-group-item-action">
          Update Product
        </Link>
        {/* <Link
          to="/dashboard/admin/products"
          className="list-group-item list-group-item-action">
          Products
        </Link> */}
        <Link
          to="/dashboard/admin/orders"
          className="list-group-item list-group-item-action">
          Orders
        </Link>
        <Link
          to="/allusers"
          className="list-group-item list-group-item-action">
          All Users
        </Link>
      </div>
    </div>
    </>
  );
};

export default AdminMenu;
