"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const initUser = {
    created_at: "",
    display_name: "",
    email: "",
    id: "",
    image_url: "",
};

export default function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                const result = await res.json()
                return result?.user || null
            } catch (error) {
                return null
            }
            //   const supabase = supabaseBrowser();
            //   const { data } = await supabase.auth.getSession();
            //   if (data.session?.user) {
            //     // fetch user information profile
            //     const { user }: any = await getUserById();

            //     return user;
            //   }
            //   return initUser;
        },
        retry: false
    });
}
