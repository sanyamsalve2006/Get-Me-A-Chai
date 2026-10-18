
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { updateProfile, fetchuser } from "@/action/useraction";
import { useRouter } from "next/navigation";

const Dashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        profilepic: "",
        coverpic: "",
        username: "",
        razorpayId: "",
        razorpaySecret: "",
    });

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status !== "authenticated" || !session?.user?.name) {
            return;
        }

        const getData = async () => {
            try {
                const u = await fetchuser(session.user.name);

                if (u) {
                    setForm((prev) => ({
                        ...prev,
                        ...u,
                        name: u.name ?? "",
                        email: u.email ?? "",
                        username: u.username ?? "",
                        razorpayId: u.razorpayId ?? "",
                        razorpaySecret: u.razorpaySecret ?? "",
                    }));
                }
            } catch (error) {
                console.error("fetchuser failed:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [status, session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (data) => {
        try {
            const result = await updateProfile(data, session.user.name);

            if (result?.error) {
                alert(result.error);
                return;
            }

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };



    if (status === "loading" || loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <div className="max-w-2xl mx-auto mt-10 p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome to Dashboard
                </h1>

                <p className="text-zinc-400 mb-8">
                    Update your profile and payment details
                </p>

                <form action={handleSubmit} className="flex flex-col gap-5">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white"
                    />

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white"
                    />

                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="username"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white"
                    />


                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400">
                            Profile Picture URL
                        </label>
                        <input
                            type="url"
                            name="profilepic"
                            value={form.profilepic || ""}
                            onChange={handleChange}
                            placeholder="https://example.com/profile.jpg"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Cover Picture URL */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400">
                            Cover Picture URL
                        </label>
                        <input
                            type="url"
                            name="coverpic"
                            value={form.coverpic || ""}
                            onChange={handleChange}
                            placeholder="https://example.com/cover.jpg"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>


                    <input
                        name="razorpayId"
                        value={form.razorpayId}
                        onChange={handleChange}
                        placeholder="Razorpay ID"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white"
                    />

                    <input
                        name="razorpaySecret"
                        type="password"
                        value={form.razorpaySecret}
                        onChange={handleChange}
                        placeholder="Razorpay Secret (leave blank to keep current)"
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white"
                    />

                    <button
                        type="submit"
                        className="mt-3 w-full cursor-pointer rounded-xl bg-blue-500 py-3.5 font-bold text-white"
                    >
                        Save Changes →
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
