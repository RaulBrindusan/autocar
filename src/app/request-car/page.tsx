"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { Car, Link2 } from "lucide-react"
import { CarSelectionForm } from "@/components/car-selection/CarSelectionForm"
import { OpenLaneForm } from "@/components/car-selection/OpenLaneForm"

export default function RequestCarPage() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'openlane') {
      setSelectedIndex(1) // Switch to OpenLane tab (index 1)
    } else if (tab === 'car') {
      setSelectedIndex(0) // Switch to Car Selection tab (index 0)
    }
  }, [searchParams])

  const tabs = [
    {
      name: "Selectează Mașina",
      icon: Car,
      description: "Alege marca, modelul și caracteristicile dorite"
    },
    {
      name: "Link OpenLane",
      icon: Link2,
      description: "Trimite un link OpenLane pentru extragerea automată a datelor"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comandă Mașina Ta
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Alege metoda preferată pentru a ne spune ce mașină îți dorești. 
            Completează detaliile manual sau trimite-ne un link OpenLane.
          </p>
        </div>

        {/* Tab Navigation */}
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex space-x-1 rounded-xl bg-white p-1 shadow-sm border border-gray-200 mb-8">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-4 px-6 text-sm font-medium leading-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    selected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.icon className="h-5 w-5" />
                  <span className="hidden sm:block">{tab.name}</span>
                </div>
                <p className={`text-xs mt-1 hidden sm:block ${
                  selectedIndex === index ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {tab.description}
                </p>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel className="focus:outline-none">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <CarSelectionForm />
              </div>
            </TabPanel>
            
            <TabPanel className="focus:outline-none">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <OpenLaneForm />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  )
}