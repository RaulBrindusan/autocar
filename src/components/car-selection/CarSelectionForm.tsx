"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Select from "react-select"
import { Button } from "@/components/ui/Button"
import { Car, DollarSign, Settings, Calendar, Fuel, Cog, Gauge } from "lucide-react"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"

const carSelectionSchema = z.object({
  make: z.string().min(1, "Selectează marca"),
  model: z.string().min(1, "Selectează modelul"),
  year: z.number().min(1985, "Anul trebuie să fie după 1985").max(new Date().getFullYear(), "Anul nu poate fi în viitor"),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  maxMileage: z.number().optional(),
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
  const [selectedFuelType, setSelectedFuelType] = useState<Option | null>(null)
  const [selectedTransmission, setSelectedTransmission] = useState<Option | null>(null)
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
    { value: "cooled-seats", label: "Scaune ventilate" },
    { value: "heated-steering", label: "Volan încălzit" },
    { value: "bluetooth", label: "Bluetooth" },
    { value: "backup-camera", label: "Cameră de mers înapoi" },
    { value: "360-camera", label: "Cameră 360°" },
    { value: "cruise-control", label: "Cruise control" },
    { value: "adaptive-cruise", label: "Cruise control adaptiv" },
    { value: "keyless", label: "Pornire fără cheie" },
    { value: "keyless-entry", label: "Acces fără cheie" },
    { value: "premium-audio", label: "Sistem audio premium" },
    { value: "xenon", label: "Faruri Xenon/LED" },
    { value: "matrix-led", label: "Faruri Matrix LED" },
    { value: "parking-sensors", label: "Senzori de parcare" },
    { value: "auto-park", label: "Parcare automată" },
    { value: "climate-control", label: "Climatizare automată" },
    { value: "dual-zone-climate", label: "Climatizare bi-zonă" },
    { value: "tri-zone-climate", label: "Climatizare tri-zonă" },
    { value: "lane-assist", label: "Asistent de bandă" },
    { value: "blind-spot", label: "Monitor unghi mort" },
    { value: "collision-warning", label: "Avertizare coliziune" },
    { value: "emergency-brake", label: "Frânare de urgență" },
    { value: "traffic-sign", label: "Recunoaștere indicatoare" },
    { value: "wireless-charging", label: "Încărcare wireless" },
    { value: "apple-carplay", label: "Apple CarPlay" },
    { value: "android-auto", label: "Android Auto" },
    { value: "heads-up-display", label: "Head-up Display" },
    { value: "panoramic-roof", label: "Plafonul panoramic" },
    { value: "electric-seats", label: "Scaune electrice" },
    { value: "memory-seats", label: "Scaune cu memorie" },
    { value: "massage-seats", label: "Scaune cu masaj" },
    { value: "sport-suspension", label: "Suspensie sport" },
    { value: "air-suspension", label: "Suspensie pneumatică" },
    { value: "awd", label: "Tracțiune integrală" },
    { value: "sport-mode", label: "Moduri de conducere" },
    { value: "start-stop", label: "Sistem Start-Stop" },
    { value: "eco-mode", label: "Mod Eco" },
    { value: "night-vision", label: "Vedere nocturnă" },
    { value: "ambient-lighting", label: "Iluminare ambientală" }
  ]

  // Fuel type options
  const fuelTypeOptions: Option[] = [
    { value: "benzina", label: "Benzină" },
    { value: "motorina", label: "Motorină" },
    { value: "hybrid", label: "Hibrid" },
    { value: "electric", label: "Electric" },
    { value: "gpl", label: "GPL" },
    { value: "cng", label: "CNG" },
    { value: "mild-hybrid", label: "Mild Hybrid" },
    { value: "plug-in-hybrid", label: "Plug-in Hybrid" },
    { value: "hydrogen", label: "Hidrogen" },
    { value: "ethanol", label: "Etanol" },
    { value: "lpg", label: "LPG" },
    { value: "flex-fuel", label: "Flex Fuel" },
    { value: "bi-fuel", label: "Bi-Fuel" },
    { value: "range-extender", label: "Range Extender" }
  ]

  // Transmission options
  const transmissionOptions: Option[] = [
    { value: "manuala", label: "Manuală" },
    { value: "automata", label: "Automată" },
    { value: "semiautomata", label: "Semiautomată" },
    { value: "cvt", label: "CVT" },
    { value: "dsg", label: "DSG" },
    { value: "tiptronic", label: "Tiptronic" },
    { value: "multitronic", label: "Multitronic" },
    { value: "s-tronic", label: "S-Tronic" },
    { value: "pdk", label: "PDK" },
    { value: "zf-8hp", label: "ZF 8HP" },
    { value: "torque-converter", label: "Torque Converter" },
    { value: "dual-clutch", label: "Dual Clutch" },
    { value: "single-speed", label: "Single Speed (Electric)" },
    { value: "e-cvt", label: "e-CVT" },
    { value: "amt", label: "AMT" },
    { value: "imt", label: "iMT" }
  ]

  // Generate years (current year down to 1985)
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const yearOptions = []
    for (let year = currentYear; year >= 1985; year--) {
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

  const handleFuelTypeChange = (option: Option | null) => {
    setSelectedFuelType(option)
    if (option) {
      setValue('fuelType', option.value)
    }
  }

  const handleTransmissionChange = (option: Option | null) => {
    setSelectedTransmission(option)
    if (option) {
      setValue('transmission', option.value)
    }
  }

  const onSubmit = async (data: CarSelectionData) => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        toast.error('Trebuie să fii conectat pentru a trimite o cerere.', {
          duration: 4000,
          position: 'top-center',
        })
        return
      }

      // Get user profile for contact information
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        toast.error('Nu am putut accesa informațiile de profil.', {
          duration: 4000,
          position: 'top-center',
        })
        return
      }

      // Map fuel type to valid enum values
      const mapFuelType = (fuelType: string | undefined) => {
        if (!fuelType) return null
        const fuelMap: { [key: string]: string } = {
          'benzina': 'gasoline',
          'motorina': 'diesel',
          'hybrid': 'hybrid',
          'electric': 'electric',
          'gpl': 'other',
          'cng': 'other',
          'mild-hybrid': 'hybrid',
          'plug-in-hybrid': 'hybrid',
          'hydrogen': 'other',
          'ethanol': 'other',
          'lpg': 'other',
          'flex-fuel': 'other',
          'bi-fuel': 'other',
          'range-extender': 'electric'
        }
        return fuelMap[fuelType] || 'other'
      }

      // Map transmission to valid enum values
      const mapTransmission = (transmission: string | undefined) => {
        if (!transmission) return null
        const transMap: { [key: string]: string } = {
          'manuala': 'manual',
          'automata': 'automatic',
          'semiautomata': 'automatic',
          'cvt': 'cvt',
          'dsg': 'automatic',
          'tiptronic': 'automatic',
          'multitronic': 'cvt',
          's-tronic': 'automatic',
          'pdk': 'automatic',
          'zf-8hp': 'automatic',
          'torque-converter': 'automatic',
          'dual-clutch': 'automatic',
          'single-speed': 'automatic',
          'e-cvt': 'cvt',
          'amt': 'automatic',
          'imt': 'manual'
        }
        return transMap[transmission] || 'other'
      }

      // Prepare submission data for the new table
      const submissionData = {
        user_id: user.id,
        brand: data.make,
        model: data.model,
        year: data.year,
        fuel_type: mapFuelType(data.fuelType),
        transmission: mapTransmission(data.transmission),
        max_mileage_km: data.maxMileage || null,
        max_budget: data.budget,
        required_features: data.features || [],
        additional_notes: data.additionalNotes || null,
        contact_name: userProfile.full_name || user.email?.split('@')[0] || 'Utilizator',
        contact_email: userProfile.email || user.email || '',
        contact_phone: userProfile.phone || null,
        status: 'pending'
      }
      
      // Save to member_car_requests table
      const { data: insertResult, error: insertError } = await supabase
        .from('member_car_requests')
        .insert(submissionData)
        .select('id')
        .single()

      if (insertError) {
        console.error('Database error:', insertError)
        console.error('Submission data:', submissionData)
        toast.error(`Eroare bază de date: ${insertError.message || 'Eroare necunoscută'}`, {
          duration: 6000,
          position: 'top-center',
        })
        return
      }

      console.log('Successfully saved car request with ID:', insertResult.id)

      // Send email notification
      try {
        console.log('Sending email notification...')
        const emailResponse = await fetch('/api/email/member-car-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        })

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json().catch(() => ({}))
          console.error('Failed to send email notification:', {
            status: emailResponse.status,
            statusText: emailResponse.statusText,
            error: errorData
          })
          // Show warning to user but don't fail the operation
          toast.error('Cererea a fost salvată, dar notificarea email a eșuat.', {
            duration: 4000,
            position: 'top-center',
          })
        } else {
          const result = await emailResponse.json()
          console.log('Email notification sent successfully:', result)
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError)
        // Show warning to user but don't fail the operation
        toast.error('Cererea a fost salvată, dar notificarea email a eșuat.', {
          duration: 4000,
          position: 'top-center',
        })
      }

      toast.success('Cererea ta a fost trimisă cu succes! O vei găsi în lista de cereri.', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
        },
      })

      // Reset form after successful submission
      window.location.reload()
      
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('A apărut o eroare. Te rugăm să încerci din nou.', {
        duration: 4000,
        position: 'top-center',
      })
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

        {/* Fuel Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Fuel className="h-4 w-4 inline mr-1" />
            Tipul de Combustibil (opțional)
          </label>
          <Select
            options={fuelTypeOptions}
            value={selectedFuelType}
            onChange={handleFuelTypeChange}
            placeholder="Selectează tipul de combustibil..."
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
            instanceId="fuel-type-select"
          />
        </div>

        {/* Transmission Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Cog className="h-4 w-4 inline mr-1" />
            Tipul de Transmisie (opțional)
          </label>
          <Select
            options={transmissionOptions}
            value={selectedTransmission}
            onChange={handleTransmissionChange}
            placeholder="Selectează tipul de transmisie..."
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable
            instanceId="transmission-select"
          />
        </div>

        {/* Max Mileage Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Gauge className="h-4 w-4 inline mr-1" />
            Kilometrajul Maxim (opțional)
          </label>
          <input
            type="number"
            {...register('maxMileage', { valueAsNumber: true })}
            placeholder="ex: 150000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
            min="0"
            max="500000"
            step="1000"
          />
          <p className="text-gray-500 text-sm mt-1">în kilometri</p>
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
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg py-4 px-8 text-lg font-semibold"
          >
            {isSubmitting ? "Se trimite..." : "Trimite Cererea"}
          </Button>
        </div>
      </form>
    </div>
  )
}