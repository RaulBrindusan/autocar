"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Select from "react-select"
import { Button } from "@/components/ui/Button"
import { Car, DollarSign, Settings, Calendar } from "lucide-react"

const carSelectionSchema = z.object({
  make: z.string().min(1, "Selectează marca"),
  model: z.string().min(1, "Selectează modelul"),
  year: z.number().min(1990, "Anul trebuie să fie după 1990").max(new Date().getFullYear(), "Anul nu poate fi în viitor"),
  budget: z.number().min(1000, "Bugetul minim este €1,000").max(500000, "Bugetul maxim este €500,000"),
  features: z.array(z.string()).optional(),
  additionalNotes: z.string().optional()
})

type CarSelectionData = z.infer<typeof carSelectionSchema>

interface Option {
  value: string
  label: string
}

export function CarSelectionForm() {
  const [makes, setMakes] = useState<Option[]>([])
  const [models, setModels] = useState<Option[]>([])
  const [years, setYears] = useState<Option[]>([])
  const [loadingMakes, setLoadingMakes] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [selectedMake, setSelectedMake] = useState<Option | null>(null)
  const [selectedModel, setSelectedModel] = useState<Option | null>(null)
  const [selectedYear, setSelectedYear] = useState<Option | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Option[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<CarSelectionData>({
    resolver: zodResolver(carSelectionSchema)
  })

  // Common car features
  const featuresOptions: Option[] = [
    { value: "leather", label: "Interior din piele" },
    { value: "sunroof", label: "Trapă" },
    { value: "navigation", label: "Sistem de navigație" },
    { value: "heated-seats", label: "Scaune încălzite" },
    { value: "bluetooth", label: "Bluetooth" },
    { value: "backup-camera", label: "Cameră de mers înapoi" },
    { value: "cruise-control", label: "Cruise control" },
    { value: "keyless", label: "Pornire fără cheie" },
    { value: "premium-audio", label: "Sistem audio premium" },
    { value: "xenon", label: "Faruri Xenon/LED" },
    { value: "parking-sensors", label: "Senzori de parcare" },
    { value: "climate-control", label: "Climatizare automată" }
  ]

  // Generate years (current year down to 1990)
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearOptions = []
    for (let year = currentYear; year >= 1990; year--) {
      yearOptions.push({ value: year.toString(), label: year.toString() })
    }
    setYears(yearOptions)
  }, [])

  // Fetch car makes on component mount
  useEffect(() => {
    fetchMakes()
  }, [])

  const fetchMakes = async () => {
    try {
      setLoadingMakes(true)
      const response = await fetch('/api/cars/makes')
      const data = await response.json()
      
      if (data.success) {
        setMakes(data.makes.map((make: any) => ({
          value: make.Make_Name,
          label: make.Make_Name
        })))
      }
    } catch (error) {
      console.error('Error fetching makes:', error)
      // Fallback to common European makes
      setMakes([
        { value: "BMW", label: "BMW" },
        { value: "Mercedes-Benz", label: "Mercedes-Benz" },
        { value: "Audi", label: "Audi" },
        { value: "Volkswagen", label: "Volkswagen" },
        { value: "Porsche", label: "Porsche" },
        { value: "Volvo", label: "Volvo" },
        { value: "Jaguar", label: "Jaguar" },
        { value: "Land Rover", label: "Land Rover" },
        { value: "MINI", label: "MINI" },
        { value: "Skoda", label: "Škoda" }
      ])
    } finally {
      setLoadingMakes(false)
    }
  }

  const fetchModels = async (make: string) => {
    try {
      setLoadingModels(true)
      const response = await fetch(`/api/cars/models?make=${encodeURIComponent(make)}`)
      const data = await response.json()
      
      if (data.success) {
        setModels(data.models.map((model: any) => ({
          value: model.Model_Name,
          label: model.Model_Name
        })))
      }
    } catch (error) {
      console.error('Error fetching models:', error)
      // Fallback models based on make
      const fallbackModels = getFallbackModels(make)
      setModels(fallbackModels)
    } finally {
      setLoadingModels(false)
    }
  }

  const getFallbackModels = (make: string): Option[] => {
    const modelMap: { [key: string]: string[] } = {
      "BMW": ["Seria 1", "Seria 3", "Seria 5", "Seria 7", "X1", "X3", "X5", "X6", "Z4"],
      "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "G-Class"],
      "Audi": ["A1", "A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "TT"],
      "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Polo", "Jetta", "Arteon"],
      "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster", "Cayman"]
    }
    
    const models = modelMap[make] || ["Model 1", "Model 2", "Model 3"]
    return models.map(model => ({ value: model, label: model }))
  }

  const handleMakeChange = (option: Option | null) => {
    setSelectedMake(option)
    setSelectedModel(null)
    setModels([])
    
    if (option) {
      setValue('make', option.value)
      fetchModels(option.value)
    }
  }

  const handleModelChange = (option: Option | null) => {
    setSelectedModel(option)
    if (option) {
      setValue('model', option.value)
    }
  }

  const handleYearChange = (option: Option | null) => {
    setSelectedYear(option)
    if (option) {
      setValue('year', parseInt(option.value))
    }
  }

  const handleFeaturesChange = (options: readonly Option[]) => {
    setSelectedFeatures(Array.from(options))
    setValue('features', options.map(opt => opt.value))
  }

  const onSubmit = async (data: CarSelectionData) => {
    try {
      console.log('Car selection data:', data)
      // TODO: Send data to backend
      alert('Cererea ta a fost trimisă cu succes! Te vom contacta în curând.')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('A apărut o eroare. Te rugăm să încerci din nou.')
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <Car className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Selectează Mașina Dorită
        </h2>
        <p className="text-gray-600">
          Completează detaliile despre mașina pe care o cauți
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Make Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca *
          </label>
          <Select
            options={makes}
            value={selectedMake}
            onChange={handleMakeChange}
            placeholder="Selectează marca..."
            isLoading={loadingMakes}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
            instanceId="make-select"
          />
          {errors.make && (
            <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
          )}
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelul *
          </label>
          <Select
            options={models}
            value={selectedModel}
            onChange={handleModelChange}
            placeholder="Selectează modelul..."
            isLoading={loadingModels}
            isDisabled={!selectedMake}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
            instanceId="model-select"
          />
          {errors.model && (
            <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
          )}
        </div>

        {/* Year Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Anul *
          </label>
          <Select
            options={years}
            value={selectedYear}
            onChange={handleYearChange}
            placeholder="Selectează anul..."
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
            instanceId="year-select"
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        {/* Budget Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Buget (EUR) *
          </label>
          <input
            type="number"
            {...register('budget', { valueAsNumber: true })}
            placeholder="ex: 25000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
            min="1000"
            max="500000"
            step="500"
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>

        {/* Features Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Settings className="h-4 w-4 inline mr-1" />
            Caracteristici Dorite (opțional)
          </label>
          <Select
            options={featuresOptions}
            value={selectedFeatures}
            onChange={handleFeaturesChange}
            placeholder="Selectează caracteristicile..."
            isMulti
            className="react-select-container"
            classNamePrefix="react-select"
            instanceId="features-select"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Adiționale (opțional)
          </label>
          <textarea
            {...register('additionalNotes')}
            placeholder="Detalii suplimentare despre mașina dorită, preferințe speciale..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg py-4 text-lg font-semibold"
        >
          {isSubmitting ? "Se trimite..." : "Trimite Cererea"}
        </Button>
      </form>
    </div>
  )
}