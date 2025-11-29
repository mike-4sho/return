import { useState, useMemo } from 'react';

// Mock data
const mockCustomer = {
  name: "Sarah Chen",
  address: {
    line1: "2847 Oakwood Drive",
    line2: "Apt 4B",
    city: "Austin",
    state: "TX",
    zip: "78704"
  },
  phone: "",
  email: "sarah.chen@email.com"
};

const mockReturn = {
  orderId: "#RT-4892",
  items: [
    { name: "Classic Fit Chino - Navy", size: "32x30", qty: 1 }
  ]
};

const TIME_WINDOWS = [
  { id: 'morning', label: 'Morning', time: '7am - 10am', icon: '🌅' },
  { id: 'midday', label: 'Midday', time: '10am - 1pm', icon: '☀️' },
  { id: 'afternoon', label: 'Afternoon', time: '1pm - 4pm', icon: '🌤️' },
];

function getNextDays(count = 7) {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
      isTomorrow: i === 1,
      fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    });
  }
  return days;
}

function formatAddress(address) {
  const parts = [address.line1];
  if (address.line2) parts.push(address.line2);
  parts.push(`${address.city}, ${address.state} ${address.zip}`);
  return parts;
}

export default function PickupScheduler({ isOpen = true, onClose }) {
  const [step, setStep] = useState('schedule'); // 'schedule' | 'confirmation'
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Form state
  const [address, setAddress] = useState(mockCustomer.address);
  const [phone, setPhone] = useState(mockCustomer.phone);
  const [email, setEmail] = useState(mockCustomer.email);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const [errors, setErrors] = useState({});

  const availableDays = useMemo(() => getNextDays(7), []);

  const validateForm = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required for tracking updates';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!selectedDate) {
      newErrors.date = 'Please select a pickup date';
    }

    if (!selectedTime) {
      newErrors.time = 'Please select a time window';
    }

    if (!address.line1.trim()) {
      newErrors.address = 'Street address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setStep('confirmation');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    // Reset state
    setStep('schedule');
    setSelectedDate(null);
    setSelectedTime(null);
    setErrors({});
  };

  const selectedDateInfo = availableDays.find(d => d.dayNum === selectedDate?.dayNum && d.month === selectedDate?.month);
  const selectedTimeInfo = TIME_WINDOWS.find(t => t.id === selectedTime);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/70 to-slate-900/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {step === 'schedule' ? (
          <ScheduleView
            address={address}
            setAddress={setAddress}
            isEditingAddress={isEditingAddress}
            setIsEditingAddress={setIsEditingAddress}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            availableDays={availableDays}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            errors={errors}
            setErrors={setErrors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onClose={handleClose}
            returnInfo={mockReturn}
          />
        ) : (
          <ConfirmationView
            address={address}
            selectedDate={selectedDateInfo}
            selectedTime={selectedTimeInfo}
            phone={phone}
            email={email}
            returnInfo={mockReturn}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

function ScheduleView({
  address,
  setAddress,
  isEditingAddress,
  setIsEditingAddress,
  phone,
  setPhone,
  email,
  setEmail,
  availableDays,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  errors,
  setErrors,
  isSubmitting,
  onSubmit,
  onClose,
  returnInfo,
}) {
  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Schedule Pickup</h2>
            <p className="text-sm text-gray-500 mt-1">
              Return {returnInfo.orderId} &middot; {returnInfo.items.length} item{returnInfo.items.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Pickup Address */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Pickup Address</label>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-sm text-coral-500 hover:text-coral-600 font-medium transition-colors"
            >
              {isEditingAddress ? 'Done' : 'Edit'}
            </button>
          </div>

          {isEditingAddress ? (
            <AddressForm address={address} setAddress={setAddress} error={errors.address} />
          ) : (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              {formatAddress(address).map((line, i) => (
                <p key={i} className={`text-sm ${i === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {line}
                </p>
              ))}
            </div>
          )}
          {errors.address && !isEditingAddress && (
            <p className="mt-1.5 text-sm text-red-500">{errors.address}</p>
          )}
        </section>

        {/* Contact Information */}
        <section>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Contact for Updates
          </label>
          <div className="space-y-3">
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                  }}
                  placeholder="Phone number (required)"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
              />
            </div>
          </div>
        </section>

        {/* Date Selection */}
        <section>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Select Pickup Date
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 date-scroll">
            {availableDays.map((day) => (
              <button
                key={`${day.month}-${day.dayNum}`}
                onClick={() => {
                  setSelectedDate(day);
                  if (errors.date) setErrors(prev => ({ ...prev, date: null }));
                }}
                className={`flex-shrink-0 w-[72px] py-3 px-2 rounded-xl border-2 transition-all ${
                  selectedDate?.dayNum === day.dayNum && selectedDate?.month === day.month
                    ? 'border-coral-500 bg-coral-50 text-coral-600'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className={`text-xs font-medium ${
                  selectedDate?.dayNum === day.dayNum && selectedDate?.month === day.month
                    ? 'text-coral-500'
                    : 'text-gray-500'
                }`}>
                  {day.isToday ? 'Today' : day.isTomorrow ? 'Tmrw' : day.dayName}
                </p>
                <p className={`text-lg font-semibold mt-0.5 ${
                  selectedDate?.dayNum === day.dayNum && selectedDate?.month === day.month
                    ? 'text-coral-600'
                    : 'text-gray-900'
                }`}>
                  {day.dayNum}
                </p>
                <p className={`text-xs ${
                  selectedDate?.dayNum === day.dayNum && selectedDate?.month === day.month
                    ? 'text-coral-500'
                    : 'text-gray-400'
                }`}>
                  {day.month}
                </p>
              </button>
            ))}
          </div>
          {errors.date && (
            <p className="mt-1.5 text-sm text-red-500">{errors.date}</p>
          )}
        </section>

        {/* Time Window Selection */}
        <section>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Select Time Window
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_WINDOWS.map((window) => (
              <button
                key={window.id}
                onClick={() => {
                  setSelectedTime(window.id);
                  if (errors.time) setErrors(prev => ({ ...prev, time: null }));
                }}
                className={`py-3 px-2 rounded-xl border-2 transition-all ${
                  selectedTime === window.id
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg block mb-1">{window.icon}</span>
                <p className={`text-sm font-medium ${
                  selectedTime === window.id ? 'text-coral-600' : 'text-gray-900'
                }`}>
                  {window.label}
                </p>
                <p className={`text-xs mt-0.5 ${
                  selectedTime === window.id ? 'text-coral-500' : 'text-gray-500'
                }`}>
                  {window.time}
                </p>
              </button>
            ))}
          </div>
          {errors.time && (
            <p className="mt-1.5 text-sm text-red-500">{errors.time}</p>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-coral-500 hover:bg-coral-600 disabled:bg-coral-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-coral-500/25"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Scheduling...</span>
            </>
          ) : (
            <>
              <span>Schedule Pickup</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </>
  );
}

function AddressForm({ address, setAddress, error }) {
  const updateField = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={address.line1}
        onChange={(e) => updateField('line1', e.target.value)}
        placeholder="Street address"
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200'
        }`}
      />
      <input
        type="text"
        value={address.line2}
        onChange={(e) => updateField('line2', e.target.value)}
        placeholder="Apt, suite, etc. (optional)"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          value={address.city}
          onChange={(e) => updateField('city', e.target.value)}
          placeholder="City"
          className="col-span-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
        />
        <input
          type="text"
          value={address.state}
          onChange={(e) => updateField('state', e.target.value)}
          placeholder="State"
          className="col-span-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
        />
        <input
          type="text"
          value={address.zip}
          onChange={(e) => updateField('zip', e.target.value)}
          placeholder="ZIP"
          className="col-span-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function ConfirmationView({ address, selectedDate, selectedTime, phone, email, returnInfo, onClose }) {
  return (
    <>
      {/* Success Header */}
      <div className="px-6 pt-8 pb-6 text-center bg-gradient-to-b from-green-50 to-white">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Pickup Scheduled!</h2>
        <p className="text-sm text-gray-500 mt-1">
          We'll send you updates via SMS
        </p>
      </div>

      {/* Summary */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedDate?.fullDate}</p>
              <p className="text-sm text-gray-500">{selectedTime?.time} ({selectedTime?.label})</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              {formatAddress(address).map((line, i) => (
                <p key={i} className={`text-sm ${i === 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{phone}</p>
              {email && <p className="text-sm text-gray-500">{email}</p>}
            </div>
          </div>
        </div>

        {/* Return Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Return Items</p>
          {returnInfo.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{item.name}</span>
              <span className="text-gray-400">Size {item.size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors"
        >
          Done
        </button>
      </div>
    </>
  );
}
