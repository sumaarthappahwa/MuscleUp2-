import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingCart, 
  X, 
  MessageCircle, 
  ChevronRight, 
  Filter,
  Package,
  CheckCircle2,
  Info,
  ArrowRight
} from 'lucide-react';
import { products, Product } from './data';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const totalCartPrice = cart.reduce((sum, p) => sum + (p.price || 0), 0);

  const sendWhatsAppMessage = () => {
    const phone = "919876543210"; // Placeholder phone number
    const message = `Hello MuscleUp! I'm interested in the following products:\n\n${cart.map(p => `- ${p.brand} ${p.title} (₹${p.price})`).join('\n')}\n\nTotal: ₹${totalCartPrice}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg">
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-zinc-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Package size={24} />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-zinc-900">
                Muscle<span className="text-emerald-600">Up</span>
              </h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="relative w-full"
                role="search"
              >
                <label htmlFor="desktop-search" className="sr-only">Search supplements</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} aria-hidden="true" />
                <input 
                  id="desktop-search"
                  type="search"
                  placeholder="Search supplements..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-full transition-all outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-zinc-600 hover:text-emerald-600 transition-colors"
                aria-label={`Open shopping cart, ${cart.length} items`}
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-zinc-100">
        <form 
          onSubmit={(e) => e.preventDefault()}
          className="relative w-full"
          role="search"
        >
          <label htmlFor="mobile-search" className="sr-only">Search supplements</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} aria-hidden="true" />
          <input 
            id="mobile-search"
            type="search"
            placeholder="Search supplements..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-transparent focus:bg-white focus:border-emerald-500 rounded-full transition-all outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar" aria-label="Product categories">
          <Filter size={18} className="text-zinc-400 mr-2 flex-shrink-0" aria-hidden="true" />
          <ul className="flex gap-2">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-emerald-300 hover:text-emerald-600'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
          {filteredProducts.map((product) => (
            <motion.article
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 product-card-shadow transition-all flex flex-col"
              role="listitem"
            >
              <div 
                className="relative aspect-square overflow-hidden bg-zinc-50 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
                role="button"
                aria-label={`View details for ${product.brand} ${product.title}`}
              >
                <img 
                  src={product.image_link} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{product.brand}</p>
                  <h3 
                    className="text-base font-display font-semibold text-zinc-900 line-clamp-2 leading-tight cursor-pointer hover:text-emerald-600 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.title}
                  </h3>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-400 line-through" aria-hidden="true">₹{(product.price || 0) * 1.2}</p>
                    <p className="text-lg font-bold text-zinc-900">
                      <span className="sr-only">Price: </span>
                      {product.price ? `₹${product.price}` : 'Contact for Price'}
                    </p>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-zinc-100"
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <ShoppingCart size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-zinc-900">No products found</h3>
            <p className="text-zinc-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="mt-6 text-emerald-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
                  <Package size={18} />
                </div>
                <h2 className="text-xl font-display font-bold tracking-tight text-white">
                  Muscle<span className="text-emerald-600">Up</span>
                </h2>
              </div>
              <p className="text-sm leading-relaxed">
                Premium supplements for elite performance. We source the highest quality ingredients to help you reach your fitness goals faster and safer.
              </p>
            </div>
            <nav aria-labelledby="footer-links-heading">
              <h4 id="footer-links-heading" className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Contact Support</a></li>
              </ul>
            </nav>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Connect</h4>
              <div className="flex gap-4 mb-6">
                <button 
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle size={20} className="text-white" aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs">© 2026 MuscleUp Supplements. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-zinc-900 hover:bg-emerald-600 hover:text-white transition-all shadow-md"
                aria-label="Close modal"
              >
                <X size={20} aria-hidden="true" />
              </button>

              <div className="w-full md:w-1/2 bg-zinc-50 flex items-center justify-center p-8">
                <img 
                  src={selectedProduct.image_link} 
                  alt="" 
                  className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 sm:p-10 overflow-y-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <CheckCircle2 size={12} className="text-emerald-500" aria-hidden="true" />
                      {selectedProduct.availability}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2">{selectedProduct.brand}</p>
                  <h2 id="modal-title" className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 leading-tight">
                    {selectedProduct.title}
                  </h2>
                </div>

                <div className="mb-8">
                  <p className="text-3xl font-bold text-zinc-900 mb-2">
                    {selectedProduct.price ? `₹${selectedProduct.price}` : 'Contact for Price'}
                  </p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Info size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Condition: {selectedProduct.condition}</p>
                      <p className="text-[10px] text-zinc-500">Authentic & Sealed Product</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-zinc-200"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => {
                        const phone = "919876543210";
                        const message = encodeURIComponent(`Hi! I'm interested in ${selectedProduct.brand} ${selectedProduct.title}. Is it available?`);
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                      }}
                      className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-xl shadow-emerald-100"
                      aria-label="Inquire via WhatsApp"
                    >
                      <MessageCircle size={28} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={24} className="text-emerald-600" aria-hidden="true" />
                  <h2 id="cart-title" className="text-xl font-display font-bold text-zinc-900">Your Cart</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 text-zinc-300">
                      <ShoppingCart size={32} />
                    </div>
                    <p className="text-zinc-500 font-medium">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-emerald-600 font-bold hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                        <img 
                          src={item.image_link} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">{item.brand}</p>
                        <h4 className="text-sm font-bold text-zinc-900 truncate mb-1">{item.title}</h4>
                        <p className="text-sm font-bold text-zinc-900">₹{item.price || 0}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors self-start"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-zinc-50 border-t border-zinc-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium">Subtotal</span>
                    <span className="text-xl font-bold text-zinc-900">₹{totalCartPrice}</span>
                  </div>
                  <p className="text-xs text-zinc-400 text-center">
                    Taxes and shipping calculated at checkout.
                  </p>
                  <button 
                    onClick={sendWhatsAppMessage}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    <MessageCircle size={20} />
                    Order via WhatsApp
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <button 
        onClick={() => {
          const phone = "919876543210";
          const message = encodeURIComponent("Hi MuscleUp! I have a question about your supplements.");
          window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle size={28} aria-hidden="true" />
      </button>
    </div>
  );
}
