import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router } from "./routers/mainRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             unit_amount: 5000, // $50.00
//             product_data: {
//               name: "Тестовый товар",
//             },
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: "https://www.youtube.com",
//       cancel_url: "https://www.youtube.com",
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error("Ошибка при создании сессии:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

const startApp = () => {
  try {
    app.listen(3000, () => {
      console.log("Server start");
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
