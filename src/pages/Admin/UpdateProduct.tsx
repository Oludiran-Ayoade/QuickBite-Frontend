import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Header from '../../components/Header';
import { useAuth } from '../../context/auth';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom'

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
}

interface CategorizedProducts {
  [category: string]: Product[];
}

const UpdateProduct: React.FC = () => {
  const { auth } = useAuth();
  const { token } = auth;

  const [products, setProducts] = useState<Product[]>([]);
  const [categorizedProducts, setCategorizedProducts] = useState<CategorizedProducts>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [editedStock, setEditedStock] = useState<number>(0);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [newImages, setNewImages] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ products: Product[] }>('http://localhost:3001/auth/getproducts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
        console.log(response.data.products);
        
      } catch (error: any) {
        console.error('Error fetching products:', error.message);
        toast.error('Failed to fetch products');
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const categorized = products.reduce((acc: CategorizedProducts, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
    setCategorizedProducts(categorized);
  }, [products]);

  const handleDelete = (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      axios.delete(`http://localhost:3001/auth/admin/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (response.data.success) {
          setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
          toast.success('Product deleted successfully');
        } else {
          console.error('Failed to delete product:', response.data.message);
          toast.error('Failed to delete product');
        }
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editingProduct) return;

    const { _id, category } = editingProduct;

    const updatedProductData = {
      name: editedName,
      description: editedDescription,
      price: editedPrice,
      stock: editedStock,
      category,
      newImage: newImages[_id], // Use the correct newImage for this product
    };

    await axios.put<{ success: boolean; product: Product; message: string }>(`http://localhost:3001/auth/admin/${_id}`, updatedProductData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      if (response.data.success) {
        setEditingProduct(null);
        setProducts(prevProducts => prevProducts.map(product => (product._id === _id ? response.data.product : product)));
        setShowModal(false);
        toast.success('Product updated successfully');
      } else {
        console.error('Failed to update product:', response.data.message);
        toast.error('Failed to update product');
      }
    })
    .catch(error => {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const newImage = e.target.files?.[0];
    if (newImage) {
      const reader = new FileReader();
      reader.readAsDataURL(newImage);
      reader.onload = () => {
        setNewImages(prevImages => ({
          ...prevImages,
          [productId]: reader.result as string,
        }));
      };
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditedName(product.name);
    setEditedDescription(product.description);
    setEditedPrice(product.price);
    setEditedStock(product.stock);
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h1 className="text-center text-orange">Product List</h1>
        <Link to='/admin' style={{color: '#d98e03'}}><h4>Back to Dashboard</h4></Link>
        <ToastContainer />

        {/* Render products per category */}
        {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
          <div key={category}>
            <h2 className="text-center text-orange mt-4 mb-2">{category} Category</h2>
            <div className="row row-cols-1 row-cols-md-4 g-4 mt-2">
              {categoryProducts.map(product => (
                <div key={product._id} className="col">
                  <div className="card h-90 product_card mb-2">
                    {product.image && (
                      <img src={product.image} className="card-img-top product_imagei" alt={`Image of ${product.name}`} />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">Name: {product.name}</h5>
                      <p className="card-text text-bold">desc: {product.description}</p>
                      <p className="card-text">Price: #{product.price}</p>
                      <p className="card-text">Stock: {product.stock}</p>
                      <button onClick={() => handleDelete(product._id)} className="btn btn-danger danger_orange">
                        Delete
                      </button>
                      <button onClick={() => handleEdit(product)} className="btn primary_orange mx-2">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Modal show={showModal} onHide={handleCancelEdit} className='modal_i'>
          <Modal.Header closeButton>
            <Modal.Title className='text-center text-orange'>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={editingProduct?.image} alt={`Image of ${editingProduct?.name}`} className='product_image' />

            <Form>
              <Form.Group className="mb-2 card-text" controlId="productName">
                <Form.Label>Name:</Form.Label>
                <Form.Control className='pro_edit' style={{marginLeft: '5px', border: '1.5px solid #d98e03'}}  type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-2 card-text" controlId="productDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control className='pro_edit' as="textarea" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-2 card-text" controlId="productPrice">
                <Form.Label>Price:</Form.Label>
                <Form.Control className='pro_edit'  type="number" value={editedPrice} onChange={(e) => setEditedPrice(Number(e.target.value))} />
              </Form.Group>

              <Form.Group className="mb-2 card-text" controlId="productStock">
                <Form.Label>Stock:</Form.Label>
                <Form.Control className='pro_edit' type="number" value={editedStock} onChange={(e) => setEditedStock(Number(e.target.value))} />
              </Form.Group>

              <Form.Group className="mb-2 card-text" controlId={`newImage_${editingProduct?._id}`}>
                <Form.Label>New Image:</Form.Label>
                <Form.Control className='pro_edit'  type="file" accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e, editingProduct?._id || '')} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" className='success_btn' onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button variant="secondary" className='secondary_btn' onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProduct;
