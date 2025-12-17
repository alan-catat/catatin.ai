import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

// Daftar kategori lengkap
const categories = [
  // Personal Categories
  { value: "Personal - Makanan & Minuman", label: "Personal - Makanan & Minuman", type: "Personal" },
  { value: "Personal - Transportasi", label: "Personal - Transportasi", type: "Personal" },
  { value: "Personal - Belanja Pribadi", label: "Personal - Belanja Pribadi", type: "Personal" },
  { value: "Personal - Hiburan", label: "Personal - Hiburan", type: "Personal" },
  { value: "Personal - Kesehatan", label: "Personal - Kesehatan", type: "Personal" },
  { value: "Personal - Pendidikan", label: "Personal - Pendidikan", type: "Personal" },
  { value: "Personal - Bonus / THR", label: "Personal - Bonus / THR", type: "Personal" },
  { value: "Personal - Olahraga", label: "Personal - Olahraga", type: "Personal" },
  { value: "Personal - Kecantikan", label: "Personal - Kecantikan", type: "Personal" },
  { value: "Personal - Hobi", label: "Personal - Hobi", type: "Personal" },
  { value: "Personal - Gaji", label: "Personal - Gaji", type: "Personal" },
  { value: "Personal - Sedekah / Zakat", label: "Personal - Sedekah / Zakat", type: "Personal" },
  { value: "Personal - Hadiah", label: "Personal - Hadiah", type: "Personal" },
  { value: "Personal - Pendapatan lainnya", label: "Personal - Pendapatan lainnya", type: "Personal" },
  { value: "Personal - Internet", label: "Personal - Internet", type: "Personal" },
  { value: "Personal - Investasi", label: "Personal - Investasi", type: "Personal" },
  { value: "Personal - Pengeluaran lainnya", label: "Personal - Pengeluaran lainnya", type: "Personal" },
  { value: "Personal - Pajak", label: "Personal - Pajak", type: "Personal" },
  { value: "Personal - Rumah Sewa/Kos", label: "Personal - Rumah Sewa/Kos", type: "Personal" },
  { value: "Personal - Tabungan", label: "Personal - Tabungan", type: "Personal" },
  { value: "Personal - Freelance", label: "Personal - Freelance", type: "Personal" },
  { value: "Personal - Elektronik", label: "Personal - Elektronik", type: "Personal" },

  // Bisnis Categories
  { value: "Bisnis - Operasional", label: "Bisnis - Operasional", type: "Bisnis" },
  { value: "Bisnis - Marketing", label: "Bisnis - Marketing", type: "Bisnis" },
  { value: "Bisnis - Gaji Tim / Freelancer", label: "Bisnis - Gaji Tim / Freelancer", type: "Bisnis" },
  { value: "Bisnis - Inventori", label: "Bisnis - Inventori", type: "Bisnis" },
  { value: "Bisnis - Peralatan", label: "Bisnis - Peralatan", type: "Bisnis" },
  { value: "Bisnis - Sewa Tempat/Kantor", label: "Bisnis - Sewa Tempat/Kantor", type: "Bisnis" },
  { value: "Bisnis - Utilitas", label: "Bisnis - Utilitas", type: "Bisnis" },
  { value: "Bisnis - Pajak & Lisensi", label: "Bisnis - Pajak & Lisensi", type: "Bisnis" },
  { value: "Bisnis - Konsultan", label: "Bisnis - Konsultan", type: "Bisnis" },
  { value: "Bisnis - Lainnya", label: "Bisnis - Lainnya", type: "Bisnis" },
  { value: "Bisnis - Bonus/Tip Klien", label: "Bisnis - Bonus/Tip Klien", type: "Bisnis" },
  { value: "Bisnis - Telekomunikasi", label: "Bisnis - Telekomunikasi", type: "Bisnis" },
  { value: "Bisnis - Transportasi / Operasi", label: "Bisnis - Transportasi / Operasi", type: "Bisnis" },
  { value: "Bisnis - Biaya Proyek/Layanan", label: "Bisnis - Biaya Proyek/Layanan", type: "Bisnis" },
  { value: "Bisnis - Biaya Entertaint", label: "Bisnis - Biaya Entertaint", type: "Bisnis" },
  { value: "Bisnis - Pendapatan", label: "Bisnis - Pendapatan", type: "Bisnis" },
  { value: "Bisnis - Uang Muka Klien / DP", label: "Bisnis - Uang Muka Klien / DP", type: "Bisnis" },
  { value: "Bisnis - Pengeluaran lainnya", label: "Bisnis - Pengeluaran lainnya", type: "Bisnis" },
  { value: "Bisnis - Pendapatan lainnya", label: "Bisnis - Pendapatan lainnya", type: "Bisnis" },
  { value: "Bisnis - Perangkat Kerja", label: "Bisnis - Perangkat Kerja", type: "Bisnis" },
  { value: "Bisnis - Pelatihan / Lokakarya", label: "Bisnis - Pelatihan / Lokakarya", type: "Bisnis" },
  { value: "Bisnis - Langganan Alat/Perangkat Lunak", label: "Bisnis - Langganan Alat/Perangkat Lunak", type: "Bisnis" },
];

interface SearchableSelectProps {
  value?: string;  // ⬅ lebih fleksibel
  onChange: (value: string) => void;
  required?: boolean;
  editable?: boolean;
  groupType?: string;
}

function SearchableSelect({ value, onChange, required = false, groupType, editable, }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);


  const baseCategories = groupType
    ? categories.filter(cat => cat.type === groupType)
    : categories; // Jika groupType kosong (misalnya, "Semua Grup"), gunakan semua

  const filteredCategories = baseCategories.filter(cat => 
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  ); 

  const selectedLabel = baseCategories.find(cat => cat.value === value)?.label || ''; // <-- Ganti 'categories' ke 'baseCategories'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (categoryValue: string) => {
    onChange(categoryValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  
  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-lg px-3 py-2 text-left flex items-center justify-between
                   bg-white dark:bg-neutral-800 dark:border-gray-600
                   hover:border-gray-400 dark:hover:border-gray-500 transition-colors
                   ${!value ? 'text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
      >
        <span className="truncate">
          {value ? selectedLabel : 'Pilih Kategori'}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border 
                      dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          
          {/* Search Input */}
          <div className="p-2 border-b dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full pl-9 pr-3 py-2 border dark:border-gray-600 rounded-lg
                         bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                Kategori tidak ditemukan
              </div>
            ) : (
              <>
                {/* Group by type */}
                {(groupType ? [groupType] : ['Personal', 'Bisnis']).map(type => {
                  const typeCategories = filteredCategories.filter(cat => cat.type === type);
                  if (typeCategories.length === 0) return null;

                  return (
                    <div key={type}>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-900 text-xs font-semibold 
                                    text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {type}
                      </div>
                      {typeCategories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => handleSelect(category.value)}
                          className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-neutral-700 
                                    transition-colors text-sm
                                    ${value === category.value 
                                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                                      : 'text-gray-700 dark:text-gray-300'}`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
export function App() {
  const [selectedCategory, setSelectedCategory] = useState('');
  return (
          
            
              <SearchableSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                required
              />
            
          
        
  );
}