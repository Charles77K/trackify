import {
  FaUsers,
  FaDollarSign,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

export const stats = [
  {
    icon: <FaUsers size={20} color="white" />,
    color: "blue",
    trend: "up",
    change: "+12%",
    value: "1,250",
    title: "Total inventory items",
  },
  {
    icon: <FaBoxOpen size={20} color="white" />,
    color: "yellow",
    trend: "up",
    change: "+5.3%",
    value: "530",
    title: "Low Stock Items",
  },
  {
    icon: <FaDollarSign size={20} color="white" />,
    color: "green",
    trend: "down",
    change: "-8.5%",
    value: "$24,000",
    title: "Today's Sales",
  },
  {
    icon: <FaShoppingCart size={20} color="white" />,
    color: "red",
    trend: "down",
    change: "-3.2%",
    value: "780",
    title: "Out of Stock",
  },
];
