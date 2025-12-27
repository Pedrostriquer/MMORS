import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  
  const total = cart.reduce((acc, item) => acc + (item.preco * item.quantity), 0);

  const handleCheckout = () => {
    const phone = "5573999916668";
    const message = encodeURIComponent(
      `Olá M MORS! Vim pelo site e gostaria de finalizar a compra:\n\n` +
      cart.map(item => `- ${item.nome} (Qtd: ${item.quantity} | Valor: ${item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`).join('\n') +
      `\n\nTotal do Pedido: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-state-wrapper">
        <div className="empty-cart-content">
          <span className="label-lux">M MORS ICON</span>
          <h2>SUA SACOLA ESTÁ VAZIA</h2>
          <p>Descubra a maestria artesanal em nossas coleções exclusivas.</p>
          <div className="divider-center"></div>
          <Link to="/" className="btn-explore">
            EXPLORAR COLEÇÕES <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade">
      <div className="cart-container">
        <header className="cart-header">
          <h1>Sua Sacola</h1>
          <span>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
        </header>
        
        <div className="cart-layout">
          {/* LISTA DE PRODUTOS */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-img-box">
                  <img src={item.media[0]?.url} alt={item.nome} />
                </div>
                
                <div className="item-details">
                  <div className="item-main-info">
                    <h3>{item.nome}</h3>
                    <p className="item-unit-price">
                      {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                  <div className="item-actions-row">
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14}/></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14}/></button>
                    </div>
                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMO E CHECKOUT */}
          <aside className="cart-summary">
            <div className="summary-card">
              <h3>RESUMO DO PEDIDO</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="summary-row">
                <span>Entrega</span>
                <span className="free-shipping">Cortesia</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <button className="btn-checkout" onClick={handleCheckout}>
                FINALIZAR NO WHATSAPP
              </button>
              <p className="checkout-note">
                Ao clicar, você será direcionado para o nosso atendimento exclusivo via WhatsApp.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;