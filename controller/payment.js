import axios from "axios";

export const initializePayment = async (req, res) => {
  try {
    const { email, cartItems, delivery } = req.body;

    
    const userId = req.user ? req.user.id : null;

    let total = 0;

    cartItems.forEach(item => {
      total += item.price * item.quantity; 
    });


    const amountInKobo = Math.round(total * 100);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo,
        callback_url: "https://queeny-pastry.vercel.app/payment-success",

        metadata: {
          userId,
          email,
          cartItems: JSON.stringify(cartItems),
          delivery: JSON.stringify(delivery)
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`, 
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`, 
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`, 
        },
        timeout: 10000,
      }
    );

    const data = response.data.data;

    
    if (data.status === "success") {
      return res.json({
        success: true,
        email: data.customer.email,
        cartItems: JSON.parse(data.metadata.cartItems),
        delivery: JSON.parse(data.metadata.delivery),
        userId: data.metadata.userId || null 
      });
    }

    return res.json({ success: false });

  } catch (err) {
    console.log("VERIFY ERROR:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};