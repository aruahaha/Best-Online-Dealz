import React, { Suspense } from "react";
import { defer, useLoaderData, Await } from "react-router-dom"
import { getAllOffers } from "../Server/api";

export function loader() {
    return defer({ offers: getAllOffers() })
}

export default function Home() {
    const data = useLoaderData()
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Await resolve={data.offers}>
                {(offers) => (
                    console.log(offers)
                )}
            </Await>
        </Suspense>
    )
}