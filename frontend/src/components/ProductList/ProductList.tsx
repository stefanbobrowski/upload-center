import { useState } from 'react';
import './product-list.css';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const handleFetchProducts = () => {
    setLoading(true);
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Error loading products');
        setLoading(false);
      });
  };

  return (
    <section className='product-list-root'>
      <button className='fetch-button' onClick={handleFetchProducts}>
        Fetch Products
      </button>
      {loading && <p>Loading products...</p>}
      <ul className='product-list'>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> — ${p.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
