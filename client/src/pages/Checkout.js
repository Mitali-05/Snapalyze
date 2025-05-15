import { useLocation } from 'react-router-dom';

function Checkout() {
  const location = useLocation();
  const { plan } = location.state || {};

  return (
    <div>
      <h1>Checkout Page</h1>
      {plan ? <p>Selected Plan: {plan}</p> : <p>No plan selected</p>}
      {/* Add your payment form here */}
    </div>
  );
}

export default Checkout;
