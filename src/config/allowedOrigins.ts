import "dotenv/config";

const allowedOrigins = [
	process.env["NODE_ENV"] === "development"
		? "http://localhost:3000"
		: "https://keystone-to74.onrender.com",
];

export default allowedOrigins;
