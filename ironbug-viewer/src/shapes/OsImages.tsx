const imageDict = {
    // Default icon to avoid a crash
    "Catchall": "missing_icon.png",
    "OS_AirConditioner_VariableRefrigerantFlow": "vrf_outdoor.png",
    "OS_AirLoopHVAC_OutdoorAirSystem": "OAMixer.png",
    "OS_AirLoopHVAC_UnitaryCoolOnly": "DXCoolingCoil.png",
    "OS_AirLoopHVAC_UnitaryHeatPump_AirToAir": "heat_pump3.png",
    "OS_AirLoopHVAC_UnitaryHeatPump_AirToAir_MultiSpeed": "heat_pump3.png",
    "OS_AirLoopHVAC_UnitarySystem": "unitary_system.png",
    "OS_AirLoopHVAC_UnitaryHeatCool_VAVChangeoverBypass": "unitary_system.png",
    "OS_AirLoopHVAC_ReturnPlenum": "return_plenum.png",
    "OS_AirLoopHVAC_SupplyPlenum": "supply_plenum.png",
    "OS_AirLoopHVAC_ZoneMixer": "mixer.png",
    "OS_AirLoopHVAC_ZoneSplitter": "splitter.png",
    "OS_AirTerminal_DualDuct_VAV": "airterminal_dualduct_vav.png",
    "OS_AirTerminal_DualDuct_ConstantVolume": "airterminal_dualduct_constantvolume.png",
    "OS_AirTerminal_DualDuct_VAV_OutdoorAir": "airterminal_dualduct_vav_outdoorair.png",
    "OS_AirTerminal_SingleDuct_ConstantVolume_CooledBeam": "chilled_beam.png",
    "OS_AirTerminal_SingleDuct_ConstantVolume_Reheat": "cav_reheat.png",
    "OS_AirTerminal_SingleDuct_ConstantVolume_FourPipeInduction": "single_ducts_constant_vol_4pipe.png",
    "OS_AirTerminal_SingleDuct_ConstantVolume_FourPipeBeam": "airterminal_fourpipebeam.png",
    "OS_AirTerminal_SingleDuct_ParallelPIU_Reheat": "parallel_fan_terminal.png",
    "OS_AirTerminal_SingleDuct_SeriesPIU_Reheat": "series_fan_terminal.png",
    "OS_AirTerminal_SingleDuct_ConstantVolume_NoReheat": "direct-air.png",
    "OS_AirTerminal_SingleDuct_VAV_NoReheat": "vav_noreheat.png",
    "OS_AirTerminal_SingleDuct_VAV_Reheat": "vav-reheat.png",
    "OS_AirTerminal_SingleDuct_InletSideMixer": "air_terminal_inlet_mixer.png",
    "OS_AirTerminal_SingleDuct_VAV_HeatAndCool_NoReheat": "vav_noreheat.png",
    "OS_AirTerminal_SingleDuct_VAV_HeatAndCool_Reheat": "vav-reheat.png",
    "OS_Boiler_HotWater": "boiler.png",
    "OS_Boiler_Steam": "boiler_steam.png",
    "OS_CentralHeatPumpSystem": "centralheatpumpsystem.png",
    "OS_Chiller_Electric_EIR": "chiller_air.png",
    "OS_Chiller_Absorption_Indirect": "chiller_absorption_indirect.png",
    "OS_Chiller_Absorption": "chiller_absorption_direct.png",
    "OS_Coil_Cooling_DX_SingleSpeed": "dxcoolingcoil_singlespeed.png",
    "OS_Coil_Cooling_DX_TwoSpeed": "dxcoolingcoil_2speed.png",
    "OS_Coil_Cooling_DX_MultiSpeed": "dx_cooling_multispeed.png",
    "OS_Coil_Cooling_DX_VariableSpeed": "cool_coil_dx_vari_speed.png",
    "OS_Coil_Cooling_LowTemperatureRadiant_ConstantFlow": "coilcoolinglowtemprad_constflow.png",
    "OS_Coil_Cooling_LowTemperatureRadiant_VariableFlow": "coilcoolinglowtemprad_varflow.png",
    "OS_Coil_Cooling_WaterToAirHeatPump_EquationFit": "wahpDXCC.png",
    "OS_Coil_Cooling_WaterToAirHeatPump_VariableSpeedEquationFit": "Coil_Cooling_WaterToAirHeatPump_VariableSpeedEquationFit.png",
    "OS_Coil_Cooling_Water": "cool_coil.png",
    "OS_Coil_Cooling_Water_Panel_Radiant": "coilcooling_water_panel_radiant.png",
    "OS_Coil_Heating_DX_SingleSpeed": "coil_ht_dx_singlespeed.png",
    "OS_Coil_Heating_DX_VariableSpeed": "ht_coil_dx_vari.png",
    "OS_Coil_Heating_Electric": "electric_furnace.png",
    "OS_Coil_Heating_Gas": "furnace.png",
    "OS_Coil_Heating_Gas_MultiStage": "furnace_multi_stage.png",
    "OS_Coil_Heating_Water": "heat_coil.png",
    "OS_Coil_Heating_LowTemperatureRadiant_ConstantFlow": "coilheatinglowtemprad_constflow.png",
    "OS_Coil_Heating_LowTemperatureRadiant_VariableFlow": "coilheatinglowtemprad_varflow.png",
    "OS_Coil_Heating_WaterToAirHeatPump_EquationFit": "wahpDXHC.png",
    "OS_Coil_Heating_WaterToAirHeatPump_VariableSpeedEquationFit": "Coil_Heating_WaterToAirHeatPump_VariableSpeedEquationFit.png",
    "OS_CoolingTower_SingleSpeed": "cooling_tower.png",
    "OS_CoolingTower_TwoSpeed": "cooling_tower_2speed.png",
    "OS_CoolingTower_VariableSpeed": "cooling_tower_variable.png",
    "OS_Connector_Mixer": "mixer.png",
    "OS_Connector_Splitter": "splitter.png",
    "OS_DistrictCooling": "districtcooling.png",
    "OS_DistrictHeating_Water": "districtheating.png",
    "OS_Duct": "duct.png",
    "OS_EvaporativeCooler_Direct_ResearchSpecial": "directEvap.png",
    "OS_EvaporativeCooler_Indirect_ResearchSpecial": "indirectEvap.png",
    "OS_Fan_ComponentModel": "fan_componentmodel.png",
    "OS_Fan_ConstantVolume": "fan_constant.png",
    "OS_Fan_OnOff": "fan_on_off.png",
    "OS_Fan_SystemModel": "fan_systemmodel.png",
    "OS_Fan_VariableVolume": "fan_variable.png",
    "OS_Fan_ZoneExhaust": "fan_zoneexhaust.png",
    "OS_FluidCooler_SingleSpeed": "fluid_cooler_single.png",
    "OS_FluidCooler_TwoSpeed": "fluid_cooler_two.png",
    "OS_GroundHeatExchanger_Vertical": "ground_heat_exchanger_vertical.png",
    "OS_GroundHeatExchanger_HorizontalTrench": "ground_heat_exchanger_horizontal.png",
    "OS_HeaderedPumps_ConstantSpeed": "headered_pumps_constant.png",
    "OS_HeaderedPumps_VariableSpeed": "headered_pumps_variable.png",
    "OS_HeatExchanger_AirToAir_SensibleAndLatent": "heat_transfer_outdoorair.png",
    "OS_HeatExchanger_FluidToFluid": "fluid_hx.png",
    "OS_HeatPump_WaterToWater_EquationFit_Cooling": "heatpump_watertowater_equationfit_cooling.png",
    "OS_HeatPump_WaterToWater_EquationFit_Heating": "heatpump_watertowater_equationfit_heating.png",
    "OS_Humidifier_Steam_Electric": "electric_humidifier.png",
    "OS_Humidifier_Steam_Gas": "gas_humidifier.png",
    "OS_EvaporativeFluidCooler_SingleSpeed": "evap_fluid_cooler.png",
    "OS_EvaporativeFluidCooler_TwoSpeed": "evap_fluid_cooler_two_speed.png",
    "OS_Generator_FuelCell_ExhaustGasToWaterHeatExchanger": "generator_fuelcell_exhaustgastowaterheatexchanger.png",
    "OS_Generator_MicroTurbine_HeatRecovery": "generator_microturbine_heatrecovery.png",
    "OS_LoadProfile_Plant": "plant_profile.png",
    "OS_Pipe_Adiabatic": "pipe.png",
    "OS_Pipe_Indoor": "pipe_indoor.png",
    "OS_Pipe_Outdoor": "pipe_outdoor.png",
    "OS_PlantComponent_TemperatureSource": "plant_temp_source.png",
    "OS_PlantComponent_UserDefined": "user_defined.png",
    "OS_Pump_ConstantSpeed": "pump_constant.png",
    "OS_Pump_VariableSpeed": "pump_variable.png",
    "OS_Refrigeration_Condenser_AirCooled": "air_cooled.png",
    "OS_Refrigeration_Condenser_Cascade": "condenser_cascade.png",
    "OS_Refrigeration_Condenser_EvaporativeCooled": "evap_cooled.png",
    "OS_Refrigeration_Condenser_WaterCooled": "water_cooled.png",
    "OS_SolarCollector_FlatPlate_PhotovoltaicThermal": "solarcollector_flatplate_photovoltaicthermal.png",
    "OS_SolarCollector_FlatPlate_Water": "solarcollector_flatplate_water.png",
    "OS_SolarCollector_IntegralCollectorStorage": "solarcollector_integralstorage.png",
    "OS_SwimmingPool_Indoor": "swimming_pool.png",
    "OS_TemperingValve": "tempering_valve.png",
    "OS_ThermalZone": "zone.png",
    "OS_ThermalStorage_Ice_Detailed": "thermal_storage_ice.png",
    "OS_ThermalStorage_ChilledWater_Stratified": "thermal_storage_strat.png",
    "OS_WaterHeater_HeatPump": "water_heater.png",
    "OS_WaterHeater_Mixed": "water_heater_mixed.png",
    "OS_WaterHeater_Stratified": "water_heater_stratified.png",
    "OS_WaterUse_Connections": "water_connection.png",
    "OS_WaterUse_Equipment": "sink.png",
    "OS_ZoneHVAC_Baseboard_RadiantConvective_Electric": "baseboard_rad_convect_electric.png",
    "OS_ZoneHVAC_Baseboard_RadiantConvective_Water": "baseboard_rad_convect_water.png",
    "OS_ZoneHVAC_Baseboard_Convective_Electric": "baseboard_electric.png",
    "OS_ZoneHVAC_Baseboard_Convective_Water": "baseboard_water.png",
    "OS_ZoneHVAC_CoolingPanel_RadiantConvective_Water": "zonehvac_coolingpanel_radiantconvective_water.png",
    "OS_ZoneHVAC_Dehumidifier_DX": "dehumidifier_dx.png",
    "OS_ZoneHVAC_EnergyRecoveryVentilator": "energy_recov_vent.png",
    "OS_Coil_Heating_Water_Baseboard": "coilheatingwater_baseboard.png",
    "OS_Coil_Heating_Water_Baseboard_Radiant": "Coil_Heating_Water_Baseboard_Radiant.png",
    "OS_Coil_Cooling_CooledBeam": "coilcoolingchilledbeam.png",
    "OS_Coil_Cooling_FourPipeBeam": "coilcoolingfourpipebeam.png",
    "OS_Coil_Heating_FourPipeBeam": "coilheatingfourpipebeam.png",
    "OS_Coil_Heating_Desuperheater": "coilheatingdesuperheater.png",
    "OS_Coil_Cooling_DX_TwoStageWithHumidityControlMode": "dxcoolingcoil_2stage_humidity.png",
    "OS_CoilSystem_Cooling_Water_HeatExchangerAssisted": "coil_system_coolingwater_heat_exchanger.png",
    "OS_CoilSystem_Cooling_DX_HeatExchangerAssisted": "coilsystem_cooling_dx.png",
    "OS_ZoneHVAC_FourPipeFanCoil": "four_pipe_fan_coil.png",
    "OS_ZoneHVAC_HighTemperatureRadiant": "hightempradiant.png",
    "OS_ZoneHVAC_LowTemperatureRadiant_VariableFlow": "lowtempradiant_varflow.png",
    "OS_ZoneHVAC_LowTemperatureRadiant_ConstantFlow": "lowtempradiant_constflow.png",
    "OS_ZoneHVAC_PackagedTerminalAirConditioner": "system_type_1.png",
    "OS_ZoneHVAC_PackagedTerminalHeatPump": "system_type_2.png",
    "OS_ZoneHVAC_TerminalUnit_VariableRefrigerantFlow": "vrf_unit.png",
    "OS_ZoneHVAC_WaterToAirHeatPump": "watertoairHP.png",
    "OS_ZoneHVAC_UnitHeater": "heat_coil-uht.png",
    "OS_ZoneHVAC_UnitVentilator": "unit_ventilator.png",
    // placeholder icons until unique icons available
    "OS_AvailabilityManager_Scheduled": "hvac-icon.png",
    "OS_AvailabilityManager_ScheduledOn": "hvac-icon.png",
    "OS_AvailabilityManager_ScheduledOff": "hvac-icon.png",
    "OS_AvailabilityManager_LowTemperatureTurnOn": "hvac-icon.png",
    "OS_AvailabilityManager_LowTemperatureTurnOff": "hvac-icon.png",
    "OS_AvailabilityManager_HighTemperatureTurnOn": "hvac-icon.png",
    "OS_AvailabilityManager_HighTemperatureTurnOff": "hvac-icon.png",
    "OS_AvailabilityManager_DifferentialThermostat": "hvac-icon.png",
    "OS_AvailabilityManager_OptimumStart": "hvac-icon.png",
    "OS_AvailabilityManager_NightCycle": "hvac-icon.png",
    "OS_AvailabilityManager_NightVentilation": "hvac-icon.png",
    "OS_AvailabilityManager_HybridVentilation": "hvac-icon.png",
};

let cleanImageDict: any = {}

const recreateObject = (obj: Record<string, any>): Record<string, any> => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = key.replace('OS_', '').replace(/_/g, '');
        acc[newKey] = obj[key];
        return acc;
    }, {} as Record<string, any>);
};

function CleanIamgeDict() {
    if (Object.keys(cleanImageDict).length === 0) {
        cleanImageDict = recreateObject(imageDict);
    }
    return cleanImageDict;
}


export function GetImage(name: string) {
    const baseUrl = "https://raw.githubusercontent.com/BuildingPerformanceSimulation/openstudio-measures/refs/heads/master/lib/measures/detailed_hvac_viewer/resources/images/";

    // console.log("Getting image for:" + name);
    const imgDic = CleanIamgeDict();
    let img = ""
    if (name in imgDic) {
        img = imgDic[name];
        return baseUrl + img;
    }

    var keyName = Object.keys(imgDic).find(_ => _.endsWith(name));
    if (keyName !== undefined && keyName in imgDic) {
        img = imgDic[keyName];
        return baseUrl + img;
    } else {
        console.log("Failed to find image for:" + name);
        img = imgDic["Catchall"];
    }
    // console.log("Found:" + img);
    return baseUrl + img;

}