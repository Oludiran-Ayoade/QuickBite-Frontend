import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductCounts: React.FC = () => {
    const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchProductCounts = async () => {
            try {
                const response = await axios.get<{ _id: string; count: number }[]>('https://quickbite-backend-1-w5az.onrender.com/auth/productcount');
                if (response.data && Array.isArray(response.data)) {
                    const countsByCategory = response.data.reduce((acc, item) => {
                        acc[item._id] = item.count;
                        return acc;
                    }, {} as { [key: string]: number });
                    setProductCounts(countsByCategory);
                    // console.log(countsByCategory);
                } else {
                    console.error('Invalid response format:', response.data);
                }
            } catch (error) {
                console.error('Error fetching product counts:', error);
            }
        };

        fetchProductCounts();
    }, []);

    return (
        <>
            <div className="container">
                <h6 className="text-center text-orange">Product Counts By Category</h6>
                <div className="row">
                    {Object.entries(productCounts).map(([category, count]) => (
                        <div key={category} className="col-md-4">
                            <div className="card rounded_orange">
                                <div className="card-body category_count">
                                    <h5 className="card-title">{category}</h5>
                                    <p className="card-text">Delicacies : {count}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductCounts;
