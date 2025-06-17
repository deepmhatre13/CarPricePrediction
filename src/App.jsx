import React, { useState } from 'react';
import { Car, Calculator, Loader2, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    car_name: '',
    model: '',
    year: '',
    kms_driven: '',
    fuel_type: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const carBrands = [
    'Maruti', 'Hyundai', 'Honda', 'Toyota', 'Ford',
    'Chevrolet', 'Renault', 'Mahindra', 'Tata', 'Skoda',
    'Volkswagen', 'BMW', 'Audi', 'Mercedes', 'Jaguar',
    'Land', 'Mitsubishi', 'Nissan', 'Volvo', 'Datsun',
    'Jeep', 'Mini', 'Ambassador', 'Force', 'Isuzu',
    'Bentley', 'Lamborghini', 'Ferrari'
  ];

  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric'];

  // Generate years from 1990 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
    if (prediction) setPrediction(null);
  };

  const validateForm = () => {
    if (!formData.car_name) return 'Please select a car brand';
    if (!formData.model.trim()) return 'Please enter the car model';
    if (!formData.year) return 'Please select the manufacturing year';
    if (!formData.kms_driven || formData.kms_driven <= 0) return 'Please enter valid kilometers driven';
    if (!formData.fuel_type) return 'Please select fuel type';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
const response = await fetch('/predict', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          car_name: formData.car_name,
          model: formData.model,
          year: parseInt(formData.year),
          kms_driven: parseFloat(formData.kms_driven),
          fuel_type: formData.fuel_type
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get prediction');
      }
      
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Please ensure the Flask backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Car Price Predictor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get accurate price predictions for your car using advanced machine learning algorithms
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Calculator className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Enter Car Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Car Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Brand
                </label>
                <select
                  name="car_name"
                  value={formData.car_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                >
                  <option value="">Select Car Brand</option>
                  {carBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Swift, City, i20"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturing Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Kilometers Driven */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometers Driven
                </label>
                <input
                  type="number"
                  name="kms_driven"
                  value={formData.kms_driven}
                  onChange={handleInputChange}
                  placeholder="e.g., 45000"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Predicting Price...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Predict Price
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Results Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Price Prediction</h2>
            </div>

            {!prediction && !loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500">Fill out the form to get your car's predicted price</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
                <p className="text-gray-600">Analyzing your car details...</p>
              </div>
            )}

            {prediction && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-emerald-600 mb-2">
                    {formatPrice(prediction.predicted_price)}
                  </h3>
                  <p className="text-gray-600">Estimated Market Price</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-3">Car Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Brand:</span>
                      <p className="font-medium">{prediction.car_details.car_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <p className="font-medium">{prediction.car_details.model}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <p className="font-medium">{prediction.car_details.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fuel Type:</span>
                      <p className="font-medium">{prediction.car_details.fuel_type}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">KMs Driven:</span>
                      <p className="font-medium">{prediction.car_details.kms_driven.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> This prediction is based on machine learning analysis of market data. 
                    Actual prices may vary based on condition, location, and market factors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by Machine Learning • Built with React & Flask</p>
        </div>
      </div>
    </div>
  );
}

export default App;