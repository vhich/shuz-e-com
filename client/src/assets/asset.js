import logo from "./images/logo.png";
import logo_white from "./images/logo_white.png";
import hero_bg from "./images/hero_bg.png";
import xpro_1 from "./images/xpro_1.png";
import xpro_1plus from "./images/xpro_1plus.png";
import feature_icon1 from "./images/icons/feature-icon1.png";
import feature_icon2 from "./images/icons/feature-icon2.png";
import feature_icon3 from "./images/icons/feature-icon3.png";
import feature_icon4 from "./images/icons/feature-icon4.png";
import season_sale_img1 from "./images/season-sale-img1.png";
import season_sale_img2 from "./images/season-sale-img2.png";
import season_sale_img3 from "./images/season-sale-img3.png";
import running_shoe1 from "./images/running_shoe1.png";

import product_img1 from "./images/product_img/product-img1.jpg";
import product_img2 from "./images/product_img/product-img2.jpg";
import product_img3 from "./images/product_img/product-img3.jpg";
import product_img4 from "./images/product_img/product-img4.jpg";
import product_img5 from "./images/product_img/product-img5.jpg";
import product_img6 from "./images/product_img/product-img6.jpg";
import product_img7 from "./images/product_img/product-img7.jpg";
import product_img8 from "./images/product_img/product-img8.jpg";

import brand_logo1 from "./images/brands/brand-logo1.png";
import brand_logo2 from "./images/brands/brand-logo2.png";
import brand_logo3 from "./images/brands/brand-logo3.png";
import brand_logo4 from "./images/brands/brand-logo4.png";
import brand_logo5 from "./images/brands/brand-logo5.png";

import DinersClub from "./images/icons/DinersClub.png";
import Mastercard from "./images/icons/Mastercard.png";
import Stripe from "./images/icons/Stripe.png";
import Visa from "./images/icons/Visa.png";

const assets = {
  logo,
  logo_white,
  hero_bg,
  xpro_1,
  xpro_1plus,
  running_shoe1,
  feature_icon1,
  feature_icon2,
  feature_icon3,
  feature_icon4,
  DinersClub,
  Mastercard,
  Visa,
  Stripe,
  season_sale_img1,
  season_sale_img2,
  season_sale_img3,
};

const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "shop",
    title: "Shop",
  },
  {
    id: "about",
    title: "About",
  },
  {
    id: "contact",
    title: "Contact",
  },
];
const userNavLinks = [
  {
    id: "orders",
    title: "Orders",
  },
  {
    id: "address",
    title: "Addresses",
  },
  {
    id: "account_details",
    title: "Account Details",
  },
];

const features = [
  {
    id: 1,
    icon: assets.feature_icon1,
    title: "Fast delivery",
    description: "Get your products delivered in record time.",
    bg: "bg-gray-700",
  },
  {
    id: 2,
    icon: assets.feature_icon2,
    title: "24/7 Support",
    description: "Our support team is here to help you anytime.",
    bg: "bg-gray-800",
  },
  {
    id: 3,
    icon: assets.feature_icon3,
    title: "Secure Payment",
    description: "We ensure secure payment with SSL encryption.",
    bg: "bg-gray-900",
  },
  {
    id: 4,
    icon: assets.feature_icon4,
    title: "Easy Returns",
    description: "Hassle-free returns within 30 days of purchase.",
    bg: "bg-gray-950",
  },
];

const category = [
  {
    id: 1,
    name: "Running Shoes",
    image: product_img1,
  },
  {
    id: 2,
    name: "Casual Shoes",
    image: product_img2,
  },
  {
    id: 3,
    name: "Loafer Shoes",
    image: product_img7,
  },
  {
    id: 4,
    name: "Sport Shoes",
    image: product_img3,
  },
  {
    id: 5,
    name: "Sport Shoes",
    image: product_img4,
  },
  {
    id: 6,
    name: "Basketball Shoes",
    image: product_img5,
  },
];

const productCard = [
  {
    id: 1,
    image: product_img1,
    name: "Product Name 1",
    price: 99.99,
    discount_percentage: 20,
  },
  {
    id: 2,
    image: product_img2,
    name: "Product Name 2",
    price: 89.99,
  },
  {
    id: 3,
    image: product_img3,
    name: "Product Name 3",
    price: 79.99,
  },
  {
    id: 4,
    image: product_img4,
    name: "Product Name 4",
    price: 69.99,
    discount_percentage: 20,
  },
  {
    id: 5,
    image: product_img5,
    name: "Product Name 5",
    price: 59.99,
  },
  {
    id: 6,
    image: product_img6,
    name: "Product Name 6",
    price: 49.99,
  },
  {
    id: 7,
    image: product_img7,
    name: "Product Name 7",
    price: 39.99,
    discount_percentage: 10,
  },
  {
    id: 8,
    image: product_img8,
    name: "Product Name 8",
    price: 29.99,
  },
];

const reviews = [
  {
    name: "Obi Cubana",
    role: "customer",
    rate_given: 5.0,
    comment:
      "The platform looks nice and the User Experience is so stress free.",
    title: "smooth user experience",
  },
  {
    name: "Victor chike",
    role: "seller",
    rate_given: 4.5,
    comment:
      "The platform looks nice and the User Experience is so stress free.",
    title: "smooth user experience",
  },
  {
    name: "ayomide israel",
    role: "seller",
    rate_given: 4.5,
    comment:
      "The platform looks nice and the User Experience is so stress free.",
    title: "smooth user experience",
  },
  {
    name: "effiong udoh",
    role: "customer",
    rate_given: 3.0,
    comment:
      "The platform looks nice and the User Experience is so stress free.",
    title: "smooth user experience",
  },
];

// Add your logo URLs here
const brands = [
  {
    name: "Nike",
    logo: brand_logo1,
  },
  {
    name: "New Balance",
    logo: brand_logo2,
  },
  {
    name: "Adidas",
    logo: brand_logo3,
  },
  {
    name: "converse",
    logo: brand_logo4,
  },
  {
    name: "Asics",
    logo: brand_logo5,
  },
];

const footerLinks = [
  {
    title: "My Account",
    links: ["Orders", "Account details", "Addresses", "Lost password"],
  },
  {
    title: "Quick Links",
    links: [
      "Home",
      "About Us",
      "Shop",
      "Product Categories",
      "Blog",
      "Contact Us",
    ],
  },
  {
    title: "Information",
    links: ["Privacy Policy", "Guarantee", "Refund and Returns Policy"],
  },
];

export {
  assets,
  navLinks,
  userNavLinks,
  features,
  category,
  productCard,
  reviews,
  brands,
  footerLinks,
};
