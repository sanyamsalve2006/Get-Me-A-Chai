"use server"
import { createHmac, timingSafeEqual } from "node:crypto"
import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDB from "@/db/connectDB"
import User from "@/models/User"


const getRazorpayCredentials = async (username) => {
    const user = await User.findOne({ username })
        .select({ razorpayId: 1, razorpaySecret: 1 })
        .lean()

    if (!user?.razorpayId || !user?.razorpaySecret) {
        throw new Error("Razorpay credentials are not configured.");
    }

    return user
};

export const initiate = async (amount, toUser, paymentForm) => {
    if (!Number.isSafeInteger(amount) || amount < 100) {
        throw new Error("Payment amount must be at least ₹1.");
    }

    const name = typeof paymentForm?.name === "string" ? paymentForm.name.trim() : "";
    if (!name || typeof toUser !== "string" || !toUser.trim()) {
        throw new Error("Your name and the recipient are required.");
    }

    await connectDB();
    const user = await getRazorpayCredentials(toUser.trim())
    const razorpay = new Razorpay({
        key_id: user.razorpayId,
        key_secret: user.razorpaySecret,
    });
    const order = await razorpay.orders.create({
        amount,
        currency: "INR",
    });

    await Payment.create({
        oid: order.id,
        amount: String(amount),
        to_user: toUser.trim(),
        name,
        message:
            typeof paymentForm?.message === "string"
                ? paymentForm.message.trim()
                : "",
    });

    return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: user.razorpayId,
    };
};

export const verifyPayment = async ({ orderId, paymentId, signature }) => {
    if (
        typeof orderId !== "string" ||
        typeof paymentId !== "string" ||
        typeof signature !== "string"
    ) {
        throw new Error("Razorpay returned incomplete payment details.");
    }

    await connectDB();
    const payment = await Payment.findOne({ oid: orderId }).lean();
    if (!payment) {
        throw new Error("The payment order could not be found.");
    }

    const user = await getRazorpayCredentials(payment.to_user);
    const expectedSignature = createHmac("sha256", user.razorpaySecret)
        .update(`${orderId}|${paymentId}`)
        .digest();
    const receivedSignature = Buffer.from(signature, "hex");
    if (
        receivedSignature.length !== expectedSignature.length ||
        !timingSafeEqual(receivedSignature, expectedSignature)
    ) {
        throw new Error("Razorpay payment verification failed.");
    }

    const updatedPayment = await Payment.findOneAndUpdate(
        { oid: orderId },
        { $set: { done: true } },
        { new: true }
    );
    if (!updatedPayment) {
        throw new Error("The payment order could not be found.");
    }

    return { success: true };
};


export const fetchuser = async (username) => {
  await connectDB();

    const u = await User.findOne({ username }).select("-razorpaySecret").lean();

  if (!u) return null;

  return JSON.parse(JSON.stringify(u));
};

export const fetchpayments = async (username) => {
  await connectDB();

  const p = await Payment.find({ to_user: username, done:true })
    .sort({ amount: -1 })
    .lean();
  return JSON.parse(JSON.stringify(p));
};

export const updateProfile = async (data , oldUsername) => {
    await connectDB()

    let ndata = Object.fromEntries(data)
    if (!ndata.razorpaySecret?.trim()) {
        delete ndata.razorpaySecret
    }
    if(oldUsername !== ndata.username) {
        let u = await User.findOne({username: ndata.username}) 
        if(u){
            return { error : "Username Already exist!"}
        }
        
    }
    await User.updateOne(
    { email: ndata.email },
    { $set: ndata }
)


}