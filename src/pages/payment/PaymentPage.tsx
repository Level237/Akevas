import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';
import visa from '@/assets/visa.png';
// Initialize Stripe
const stripePromise = loadStripe('pk_test_oKhSR5nslBRnBZpjO6KuzZeX');

const Header = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SecureLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2d3748;
  font-size: 0.875rem;
  
  svg {
    color: #ed7e0f;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;
  font-size: 0.875rem;
  font-weight: 500;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  &:hover {
    color: #ed7e0f;
  }
`;

const Logo = styled.img`
  height: 40px;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 32px;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0px 0px 6px rgba(0.1, 0.1, 0.1, 0.1);
  border: 1px solid rgba(61, 53, 53, 0.2);
  padding: 2rem;
  overflow: hidden;
`;

const PaymentContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 1rem;
  }
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CardContainer = styled.div`
  padding: 1.5rem;
  border: 1px solid rgba(61, 53, 53, 0.2);
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: #ed7e0f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #d97100;
  }

  &:disabled {
    background: #ffc195;
    cursor: not-allowed;
  }
`;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (stripeError) {
      setError(stripeError.message || 'Une erreur est survenue');
      setProcessing(false);
      return;
    }

    // Ici, vous pouvez envoyer paymentMethod.id à votre backend
    console.log('Payment Method:', paymentMethod);
    setProcessing(false);
  };

  return (

    <PaymentForm onSubmit={handleSubmit}>
      <div className='flex justify-center items-center gap-2'>

        <img className='w-24 h-24' src={visa} alt="Visa" />
      </div>

      <CardContainer>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                iconColor: '#ed7e0f',
              },
              invalid: {
                color: '#9e2146',
                iconColor: '#9e2146'
              },
            },
            hidePostalCode: true,
          }}
        />
      </CardContainer>
      {error && <div style={{ color: '#9e2146' }}>{error}</div>}
      <Button type="submit" disabled={!stripe || processing}>
        {processing ? 'Traitement...' : 'Payer maintenant'}
      </Button>
    </PaymentForm>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/checkout')}>
            <ArrowLeft size={20} />
            Retour
          </BackButton>
          <Logo src={logo} alt="Logo" />
        </HeaderLeft>
        <HeaderRight>
          <StepIndicator>
            Étape 2/2 : Paiement
          </StepIndicator>
          <SecureLabel>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Paiement sécurisé
          </SecureLabel>
        </HeaderRight>
      </Header>
      <div className="max-w-[800px] mx-auto p-8">
        <Card>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </Card>
      </div>
    </>
  );
};

export default PaymentPage;
