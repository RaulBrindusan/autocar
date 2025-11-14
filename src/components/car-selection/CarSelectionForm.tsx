"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Select from "react-select"
import { Button } from "@/components/ui/Button"
import { Car, DollarSign, Settings, Calendar, Fuel, Cog, Gauge } from "lucide-react"
import toast from "react-hot-toast"
// import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/LanguageContext"
import { trackCarSelection, trackCarRequest } from "@/lib/umami"

// Schema will be created dynamically with translations
type CarSelectionData = {
  make: string
  model: string
  year: number
  fuelType?: string
  transmission?: string
  maxMileage?: number
  budget: number
  features?: string[]
  additionalNotes?: string
}

interface Option {
  value: string
  label: string
}

export function CarSelectionForm() {
  const { t } = useLanguage()
  
  // Create schema with translations
  const carSelectionSchema = z.object({
    make: z.string().min(1, t('validation.select_make')),
    model: z.string().min(1, t('validation.select_model')),
    year: z.number().min(1985, t('validation.year_after_1985')).max(new Date().getFullYear(), t('validation.year_not_future')),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    maxMileage: z.number().optional(),
    budget: z.number().min(1000, t('validation.budget_min')).max(500000, t('validation.budget_max')),
    features: z.array(z.string()).optional(),
    additionalNotes: z.string().optional()
  })

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
  const [userRequestCount, setUserRequestCount] = useState(0)
  const [isCheckingLimit, setIsCheckingLimit] = useState(true)

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
    { value: "leather", label: t('car_features.leather') },
    { value: "sunroof", label: t('car_features.sunroof') },
    { value: "navigation", label: t('car_features.navigation') },
    { value: "heated-seats", label: t('car_features.heated_seats') },
    { value: "cooled-seats", label: t('car_features.cooled_seats') },
    { value: "heated-steering", label: t('car_features.heated_steering') },
    { value: "bluetooth", label: t('car_features.bluetooth') },
    { value: "backup-camera", label: t('car_features.backup_camera') },
    { value: "360-camera", label: t('car_features.360_camera') },
    { value: "cruise-control", label: t('car_features.cruise_control') },
    { value: "adaptive-cruise", label: t('car_features.adaptive_cruise') },
    { value: "keyless", label: t('car_features.keyless') },
    { value: "keyless-entry", label: t('car_features.keyless_entry') },
    { value: "premium-audio", label: t('car_features.premium_audio') },
    { value: "xenon", label: t('car_features.xenon') },
    { value: "matrix-led", label: t('car_features.matrix_led') },
    { value: "parking-sensors", label: t('car_features.parking_sensors') },
    { value: "auto-park", label: t('car_features.auto_park') },
    { value: "climate-control", label: t('car_features.climate_control') },
    { value: "dual-zone-climate", label: t('car_features.dual_zone_climate') },
    { value: "tri-zone-climate", label: t('car_features.tri_zone_climate') },
    { value: "lane-assist", label: t('car_features.lane_assist') },
    { value: "blind-spot", label: t('car_features.blind_spot') },
    { value: "collision-warning", label: t('car_features.collision_warning') },
    { value: "emergency-brake", label: t('car_features.emergency_brake') },
    { value: "traffic-sign", label: t('car_features.traffic_sign') },
    { value: "wireless-charging", label: t('car_features.wireless_charging') },
    { value: "apple-carplay", label: t('car_features.apple_carplay') },
    { value: "android-auto", label: t('car_features.android_auto') },
    { value: "heads-up-display", label: t('car_features.heads_up_display') },
    { value: "panoramic-roof", label: t('car_features.panoramic_roof') },
    { value: "electric-seats", label: t('car_features.electric_seats') },
    { value: "memory-seats", label: t('car_features.memory_seats') },
    { value: "massage-seats", label: t('car_features.massage_seats') },
    { value: "sport-suspension", label: t('car_features.sport_suspension') },
    { value: "air-suspension", label: t('car_features.air_suspension') },
    { value: "awd", label: t('car_features.awd') },
    { value: "sport-mode", label: t('car_features.sport_mode') },
    { value: "start-stop", label: t('car_features.start_stop') },
    { value: "eco-mode", label: t('car_features.eco_mode') },
    { value: "night-vision", label: t('car_features.night_vision') },
    { value: "ambient-lighting", label: t('car_features.ambient_lighting') }
  ]

  // Fuel type options
  const fuelTypeOptions: Option[] = [
    { value: "benzina", label: t('fuel_types.benzina') },
    { value: "motorina", label: t('fuel_types.motorina') },
    { value: "hybrid", label: t('fuel_types.hybrid') },
    { value: "electric", label: t('fuel_types.electric') },
    { value: "gpl", label: t('fuel_types.gpl') },
    { value: "cng", label: t('fuel_types.cng') },
    { value: "mild-hybrid", label: t('fuel_types.mild_hybrid') },
    { value: "plug-in-hybrid", label: t('fuel_types.plug_in_hybrid') },
    { value: "hydrogen", label: t('fuel_types.hydrogen') },
    { value: "ethanol", label: t('fuel_types.ethanol') },
    { value: "lpg", label: t('fuel_types.lpg') },
    { value: "flex-fuel", label: t('fuel_types.flex_fuel') },
    { value: "bi-fuel", label: t('fuel_types.bi_fuel') },
    { value: "range-extender", label: t('fuel_types.range_extender') }
  ]

  // Transmission options
  const transmissionOptions: Option[] = [
    { value: "manuala", label: t('transmission.manuala') },
    { value: "automata", label: t('transmission.automata') },
    { value: "semiautomata", label: t('transmission.semiautomata') },
    { value: "cvt", label: t('transmission.cvt') },
    { value: "dsg", label: t('transmission.dsg') },
    { value: "tiptronic", label: t('transmission.tiptronic') },
    { value: "multitronic", label: t('transmission.multitronic') },
    { value: "s-tronic", label: t('transmission.s_tronic') },
    { value: "pdk", label: t('transmission.pdk') },
    { value: "zf-8hp", label: t('transmission.zf_8hp') },
    { value: "torque-converter", label: t('transmission.torque_converter') },
    { value: "dual-clutch", label: t('transmission.dual_clutch') },
    { value: "single-speed", label: t('transmission.single_speed') },
    { value: "e-cvt", label: t('transmission.e_cvt') },
    { value: "amt", label: t('transmission.amt') },
    { value: "imt", label: t('transmission.imt') }
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

  // Check user's current request count
  useEffect(() => {
    const checkUserRequestCount = async () => {
      try {
        // const supabase = createClient() // Firebase migration
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { count } = await supabase
            .from('member_car_requests')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
          
          setUserRequestCount(count || 0)
        }
      } catch (error) {
        console.error('Error checking request count:', error)
        setUserRequestCount(0)
      } finally {
        setIsCheckingLimit(false)
      }
    }

    checkUserRequestCount()
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
      
      // Track car make selection
      trackCarSelection.makeSelected(option.value)
    }
  }

  const handleModelChange = (option: Option | null) => {
    setSelectedModel(option)
    if (option) {
      setValue('model', option.value)
      
      // Track car model selection
      if (selectedMake) {
        trackCarSelection.modelSelected(selectedMake.value, option.value)
      }
    }
  }

  const handleYearChange = (option: Option | null) => {
    setSelectedYear(option)
    if (option) {
      setValue('year', parseInt(option.value))
      
      // Track car year selection
      trackCarSelection.yearSelected(option.value)
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
      // const supabase = createClient() // Firebase migration
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        toast.error(t('toast.login_required'), {
          duration: 4000,
          position: 'top-center',
        })
        return
      }

      // Check if user has already reached the 3 request limit
      if (userRequestCount >= 3) {
        toast.error('Ai atins limita maximă de 3 cereri pentru mașini. Nu poți trimite mai multe cereri.', {
          duration: 6000,
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
        toast.error(t('toast.profile_error'), {
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
        toast.error(`${t('toast.database_error')}: ${insertError.message || 'Unknown error'}`, {
          duration: 6000,
          position: 'top-center',
        })
        return
      }

      console.log('Successfully saved car request with ID:', insertResult.id)
      
      // Update the local request count
      setUserRequestCount(prev => prev + 1)

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
          toast.error(t('toast.email_failed'), {
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
        toast.error(t('toast.email_failed'), {
          duration: 4000,
          position: 'top-center',
        })
      }

      toast.success(t('toast.request_success'), {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
        },
      })

      // Track successful member car request submission
      trackCarRequest.memberRequestSubmitted({
        budget: data.budget,
        carType: `${data.make} ${data.model} ${data.year}`
      })

      // Reset form after successful submission
      window.location.reload()
      
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error(t('toast.general_error'), {
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
          {t('car_form.title')}
        </h2>
        <p className="text-gray-600">
          {t('car_form.subtitle')}
        </p>
      </div>

      {/* Request Limit Status */}
      {!isCheckingLimit && (
        <div className={`mb-6 p-4 rounded-lg border ${
          userRequestCount >= 3 
            ? 'bg-red-50 border-red-200' 
            : userRequestCount === 2
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-3 ${
              userRequestCount >= 3 ? 'bg-red-500' : userRequestCount === 2 ? 'bg-yellow-500' : 'bg-blue-500'
            }`}></div>
            <div>
              <p className={`font-medium ${
                userRequestCount >= 3 ? 'text-red-800' : userRequestCount === 2 ? 'text-yellow-800' : 'text-blue-800'
              }`}>
                {userRequestCount >= 3 
                  ? 'Ai atins limita maximă de cereri' 
                  : `Ai folosit ${userRequestCount} din 3 cereri disponibile`}
              </p>
              <p className={`text-sm ${
                userRequestCount >= 3 ? 'text-red-600' : userRequestCount === 2 ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {userRequestCount >= 3 
                  ? 'Nu mai poți trimite cereri pentru mașini noi.' 
                  : userRequestCount === 2
                  ? 'Mai ai doar o cerere rămasă!'
                  : `Îți mai rămân ${3 - userRequestCount} cereri.`}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Make Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('car_form.make_label')}
          </label>
          <Select
            options={makes}
            value={selectedMake}
            onChange={handleMakeChange}
            placeholder={t('car_form.make_placeholder')}
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
            {t('car_form.model_label')}
          </label>
          <Select
            options={models}
            value={selectedModel}
            onChange={handleModelChange}
            placeholder={t('car_form.model_placeholder')}
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
            {t('car_form.year_label')}
          </label>
          <Select
            options={years}
            value={selectedYear}
            onChange={handleYearChange}
            placeholder={t('car_form.year_placeholder')}
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
            {t('car_form.fuel_type_label')}
          </label>
          <Select
            options={fuelTypeOptions}
            value={selectedFuelType}
            onChange={handleFuelTypeChange}
            placeholder={t('car_form.fuel_type_placeholder')}
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
            {t('car_form.transmission_label')}
          </label>
          <Select
            options={transmissionOptions}
            value={selectedTransmission}
            onChange={handleTransmissionChange}
            placeholder={t('car_form.transmission_placeholder')}
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
            {t('car_form.max_mileage_label')}
          </label>
          <input
            type="number"
            {...register('maxMileage', { valueAsNumber: true })}
            placeholder={t('car_form.max_mileage_placeholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
            min="0"
            max="500000"
            step="1000"
          />
          <p className="text-gray-500 text-sm mt-1">{t('car_form.max_mileage_hint')}</p>
        </div>

        {/* Budget Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            {t('car_form.budget_label')}
          </label>
          <input
            type="number"
            {...register('budget', { valueAsNumber: true })}
            placeholder={t('car_form.budget_placeholder')}
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
            {t('car_form.features_label')}
          </label>
          <Select
            options={featuresOptions}
            value={selectedFeatures}
            onChange={handleFeaturesChange}
            placeholder={t('car_form.features_placeholder')}
            isMulti
            className="react-select-container"
            classNamePrefix="react-select"
            instanceId="features-select"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('car_form.additional_notes_label')}
          </label>
          <textarea
            {...register('additionalNotes')}
            placeholder={t('car_form.additional_notes_placeholder')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-700 text-black"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting || userRequestCount >= 3 || isCheckingLimit}
            className={`transition-all duration-300 py-4 px-8 text-lg font-semibold ${
              userRequestCount >= 3 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 hover:shadow-lg'
            }`}
          >
            {isCheckingLimit ? 'Se verifică...' :
             isSubmitting ? t('car_form.submitting_button') :
             userRequestCount >= 3 ? 'Limita atinsă' :
             t('car_form.submit_button')}
          </Button>
        </div>
      </form>
    </div>
  )
}