import React from "react";

export default function DashboardLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    return <main className={"max-w-screen"}>
        <section
            className={"mx-auto w-full max-w-screen-2xl  min-h-screen max-h-screen h-screen"}>
            {children}
        </section>
    </main>
}