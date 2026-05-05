import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export const WhatsAppFloat = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const whatsappNumber = '50688083390';
  const defaultMessage = 'Hola! Me gustaría obtener más información sobre los servicios de SUNANDA Spa.';

  const quickMessages = [
    { text: 'Agendar una cita', emoji: '📅' },
    { text: 'Consultar precios', emoji: '💰' },
    { text: 'Información general', emoji: 'ℹ️' }
  ];

  const handleQuickMessage = (message: string) => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
    setIsExpanded(false);
  };

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* WhatsApp Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Expanded Menu */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 w-72 bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="SUNANDA" 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold">SUNANDA Spa</h3>
                  <p className="text-xs text-green-100">En línea</p>
                </div>
              </div>
              <p className="text-sm text-green-50">
                ¿En qué podemos ayudarte hoy?
              </p>
            </div>

            {/* Quick Messages */}
            <div className="p-4 space-y-2">
              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickMessage(msg.text)}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-2xl transition-colors duration-200 group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{msg.emoji}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                      {msg.text}
                    </span>
                  </span>
                </button>
              ))}

              {/* Custom Message */}
              <button
                onClick={() => handleQuickMessage(defaultMessage)}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Iniciar conversación
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Respuesta típica en menos de 5 minutos
              </p>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          aria-label={isExpanded ? 'Cerrar chat' : 'Abrir chat de WhatsApp'}
        >
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
          
          {/* Icon */}
          <div className="relative z-10">
            {isExpanded ? (
              <X className="w-7 h-7" />
            ) : (
              <MessageCircle className="w-7 h-7" />
            )}
          </div>

          {/* Notification Badge */}
          {!isExpanded && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
          )}
        </button>

        {/* Tooltip */}
        {!isExpanded && (
          <div className="absolute bottom-20 right-0 hidden md:block">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ¿Necesitas ayuda?
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 dark:bg-white transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
