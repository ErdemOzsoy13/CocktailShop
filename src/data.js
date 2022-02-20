import { FaCreditCard, FaBriefcase } from "react-icons/fa";
import React from "react";
export default [
  {
    page: "products",
    links: [
      { label: "payment", icon: <FaCreditCard />, url: "/products" },
      { label: "terminal", icon: <FaCreditCard />, url: "/products" },
      { label: "connect", icon: <FaCreditCard />, url: "/products" },
    ],
  },
  {
    page: "company",
    links: [
      { label: "about", icon: <FaBriefcase />, url: "/about" },
      { label: "customers", icon: <FaBriefcase />, url: "/products" },
    ],
  },
];
