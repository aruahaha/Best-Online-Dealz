import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import OfferItems from "../Components/OfferItems";

export default function OfferDetail() {
    const params = useParams();
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`https://bodz-server.vercel.app/api/getItem/${params.id}`)
            .then(res => {
                setItem(res?.data?.item?.ItemsResult?.Items[0]);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [params.id]);

    return (
        <div className="offer-detail-container">
            {loading ? (
                <div className="loading-container">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <div className="offer-page">
                        <div className="offer-img-div">
                            <img className="offer-img" src={item?.Images?.Primary?.Large?.URL} alt="" />
                        </div>
                        <div className="offer-info-price-div">
                            <div className="offer-info">
                                <div className="offer-title-div">
                                    <h1 className="offer-title">{item?.ItemInfo?.Title?.DisplayValue.split(',').slice(0, 3).join('\n')}</h1>
                                </div>
                                <div className="offer-description-div">
                                    {item?.ItemInfo?.Features?.DisplayValues.slice(0, 2).map((itemDetailInfo, index) => (
                                        <ul key={index} className="offer-description-ul">
                                            <li key={index} className="offer-description">{itemDetailInfo}</li>
                                        </ul>
                                    ))}
                                </div>
                            </div>
                            <div className="offer-price-div">
                                {item?.Offers ? (
                                    item?.Offers?.Listings?.map((itemPrice, index) => (
                                        <div key={index}>
                                            <p className="og-price">{itemPrice?.SavingBasis?.DisplayAmount}</p>
                                            <span>(-{itemPrice?.Price?.Savings?.Percentage}%)</span>
                                            <p className="offer-price">₹ {itemPrice?.Price?.Amount}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Please check the price on Amazon</p>
                                )}
                                <Link to={item?.DetailPageURL} target="_blank" className="buy-now-btn">Buy Now</Link>
                                <p>
                                    Please be aware that product prices may vary at times,
                                    attributed to factors such as different sellers or concluded
                                    promotional offers.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
