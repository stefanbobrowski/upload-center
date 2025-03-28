import { useState, useEffect } from 'react';
import './product-list.css';

type Product = {
  id: number;
  name: string;
  price: number;
};

const MAX_REQUESTS = 3; // match your backend productLimiter

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [requestsRemaining, setRequestsRemaining] =
    useState<number>(MAX_REQUESTS);

  useEffect(() => {
    // Load cached products if available
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

    // Load remaining request count
    const storedRequests = sessionStorage.getItem('product-requests-remaining');
    if (storedRequests) {
      setRequestsRemaining(parseInt(storedRequests, 10));
    }
  }, []);

  const handleFetchProducts = () => {
    if (requestsRemaining <= 0) {
      setError('Request limit reached. Please wait before trying again.');
      return;
    }

    const cached = sessionStorage.getItem('product-cache');
    if (cached) {
      setProducts(JSON.parse(cached));
      return;
    }

    setLoading(true);
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: Product[]) => {
        sessionStorage.setItem('product-cache', JSON.stringify(data));
        setProducts(data);

        const newCount = requestsRemaining - 1;
        sessionStorage.setItem(
          'product-requests-remaining',
          newCount.toString()
        );
        setRequestsRemaining(newCount);
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
      {products.length === 0 && (
        <button
          className='fetch-button'
          onClick={handleFetchProducts}
          disabled={requestsRemaining <= 0}
        >
          Fetch Products
        </button>
      )}

      {loading && <p>Loading products...</p>}
      {error && <p className='error-message'>{error}</p>}

      <div className='request-counter'>
        Requests remaining: {requestsRemaining}
      </div>

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
