import { useState, useEffect } from 'react';
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
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(
    null
  );

  const handleFetchProducts = () => {
    if (requestsRemaining === 0) {
      setError('Request limit reached. Please wait before trying again.');
      return;
    }

    setLoading(true);
    fetch('/api/products')
      .then((res) => {
        const remaining = res.headers.get('X-RateLimit-Remaining');
        if (remaining !== null) {
          setRequestsRemaining(parseInt(remaining, 10));
        }
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: Product[]) => {
        sessionStorage.setItem('product-cache', JSON.stringify(data));
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Error loading products');
        setLoading(false);
      });
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('product-cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      } catch {
        sessionStorage.removeItem('product-cache');
      }
    }
  }, []);

  return (
    <section className='product-list-root'>
      {products.length === 0 && (
        <button
          className='fetch-button'
          onClick={handleFetchProducts}
          disabled={requestsRemaining === 0}
        >
          Fetch Products
        </button>
      )}

      {loading && <p>Loading products...</p>}
      <ul className='product-list'>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> — ${p.price}
          </li>
        ))}
      </ul>
      {error && <p className='error-message'>{error}</p>}

      {requestsRemaining !== null && (
        <div
          className={`request-counter${
            requestsRemaining <= 0 ? ' depleted' : ''
          }`}
        >
          Requests remaining: {requestsRemaining}
        </div>
      )}
    </section>
  );
}
