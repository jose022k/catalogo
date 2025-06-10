import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

function App() {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const categories = [
    { name: 'HARINA', count: 4 },
    { name: 'ARROZ', count: 4 },
    { name: 'PASTA', count: 5 },
    { name: 'GRANOS', count: 3 },
    { name: 'MARGARINA', count: 2 },
    { name: 'ACEITE', count: 3 },
    { name: 'AZÚCAR Y PAPELÓN', count: 4 },
    { name: 'CAFÉ', count: 2 },
    { name: 'CONDIMENTOS', count: 1 },
    { name: 'SALSAS', count: 5 },
    { name: 'ENLATADOS', count: 3 },
    { name: 'PROTEÍNA', count: 2 },
    { name: 'LIMPIEZA E HIGIENE', count: 6 }
  ];

  const formatFileName = (category: string) => {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar acentos
      .replace(/[^a-z0-9]/gi, '-')     // reemplazar espacios y otros por "-"
      + '.jpg';
  };

  const toggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const generateWhatsAppMessage = () => {
    if (selectedProducts.size === 0) {
      return 'Hola, estuve viendo su catálogo y me interesa saber el precio de...';
    } else {
      const productNames = Array.from(selectedProducts).map(id => {
        const [category, index] = id.split('-');
        return `${category} ${index}`;
      }).join(', ');
      return `Hola, estuve viendo su catálogo y me interesa: ${productNames}`;
    }
  };

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/584122923778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const ProductGrid = ({ category, count }: { category: string; count: number }) => {
    const products = Array.from({ length: count }, (_, index) => ({
      id: `${category}-${index + 1}`,
      name: `${category} ${index + 1}`,
      category,
      selected: selectedProducts.has(`${category}-${index + 1}`)
    }));

    const imageFile = formatFileName(category);

    return (
      <div className="mb-12">
        {/* Category Background Section */}
        <div className="relative h-32 mb-8 rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />
          <h2 className="relative text-4xl font-bold text-white text-center tracking-wider drop-shadow-lg z-20">
            {category}
          </h2>
          <img
            src={`/images/${imageFile}`}
            alt={category}
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-60"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`${
                count === 4 && index === 3 ? 'md:col-start-1' :
                count === 5 && index === 4 ? 'md:col-start-2' :
                count === 1 ? 'md:col-start-2' : ''
              } bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm text-center">Espacio para imagen del producto</span>
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-gray-800 mb-3 text-center">
                [Nombre del Producto]
              </h3>

              {/* Checkbox */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">Marcar</span>
                <button
                  onClick={() => toggleProduct(product.id)}
                  className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                    product.selected
                      ? 'bg-red-500 border-red-500'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  {product.selected && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#68abe1] to-[#47437e]">
      {/* Header */}
      <header className="h-32 bg-white/10 backdrop-blur-sm flex items-center justify-center border-b border-white/20">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="h-64 rounded-lg overflow-hidden">
            <img
              src="/images/header.jpg"
              alt="Header"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {categories.map((category, index) => (
          <ProductGrid
            key={index}
            category={category.name}
            count={category.count}
          />
        ))}
      </main>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>

      {/* Selected Products Counter */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-40">
          <span className="text-sm font-medium text-gray-700">
            {selectedProducts.size} producto{selectedProducts.size !== 1 ? 's' : ''} seleccionado{selectedProducts.size !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
