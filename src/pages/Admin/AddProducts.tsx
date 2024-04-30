import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Header from '../../components/Header';
import ProductCounts from './ProductCounts';
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import Footer from "../../components/Footer";


interface ProductData {
    name: string;
    description: string;
    price: number | '';
    category: string;
    stock: number | '';
    image: string;
}

const AddProducts: React.FC = () => {
    const endpoint = 'http://localhost:3001/auth/admin/addproducts';

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number | ''>('');
    const [category, setCategory] = useState<string>('');
    const [stock, setStock] = useState<number | ''>('');
    const [image, setImage] = useState<string>('');

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const myImage = e.target.files && e.target.files[0];

        if (myImage) {
            const reader = new FileReader();
            reader.readAsDataURL(myImage);

            reader.onload = () => {
                setImage(reader.result as string);
            };
        }
    };

    const handleUpload = () => {
        const productData: ProductData = {
            name,
            description,
            price: price === '' ? '' : Number(price), // Convert price to number if not empty,
            category,
            stock: stock === '' ? '' : Number(stock), // Convert stock to number if not empty
            image,
        };

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token not found. Please log in again.');
            return;
        }

        axios.post(endpoint, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                console.log(res.data);
                toast.success('Product saved successfully');

                 // Clear all input fields and reset state values
                 setName('');
                 setDescription('');
                 setPrice(''); // Reset to initial value
                 setCategory('');
                 setStock(''); // Reset to initial value
                 setImage('');
            })
            .catch((error) => {
                console.error('Error uploading product:', error);
            });
    };

    return (
       <>
       <Header />
        <div className="container shadow-lg rounded-4" style={{display: "flex", marginTop: '18px'}}>
            <form>
                <div className="mb-3">
                    <label className="form-label text-orange" style={{fontSize: "20px"}}>Name:</label>
                    <input type="text" className="form-control input_add" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label text-orange" style={{fontSize: "20px"}}>Description:</label>
                    <input type="text" className="form-control input_add" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="form-label text-orange" style={{fontSize: "20px", marginTop: "-10px"}}>Price:</label>
                    <input type="number" className="form-control input_add" style={{marginTop: "-10px"}} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>

                <div className="mb-3">
                    <label className="form-label text-orange" style={{fontSize: "20px"}}>Category:</label>
                    <select className="form-select input_add input_cat" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="" disabled>Select a category</option>
                        <option value="Burger">Burger</option>
                        <option value="Shawarma">Shawarma</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Chicken Pie">Chicken Pie</option>
                        <option value="Fried Chicken & Chips">Fried Chicken & Chips</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label text-orange" style={{fontSize: "20px"}}>Stock:</label>
                    <input type="number" className="form-control input_add" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                </div>

                <div className="mb-3" style={{marginTop: "-10px"}}>
                    <label className="form-label text-orange" style={{fontSize: "20px"}}>Image:</label>
                    <input type="file" className="form-control input_add" accept="image/*" onChange={handleImageUpload} multiple />
                </div>

                <button type="button" className="btn button_submit" onClick={handleUpload}>Upload Product</button>
            </form>
            <div>
            <h1 className='text-orange logo_design'>QuickBite</h1>
            <ProductCounts />
            <div className='proceed_edit'>
            <FaArrowRightLong style={{ color: '#d98e03', marginTop: '10px'}} size={35} className='arrow' />
            <Link to='/updateproducts' style={{color: '#d98e03'}}><h5>proceed to edit products</h5></Link>
            </div>
        </div>
        </div>
        <ToastContainer />
        <Footer />
       </>
    );
};

export default AddProducts;
