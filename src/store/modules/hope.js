import { getRegionRank, getProvinceRank, getPosSalary } from '@/utils/api'
import { TopFiveDate } from '@/utils/utils'
const hope = {
	state: {
		isReady: false,
		hopeSalary: '',
		hopeCity: '',
		hopeType: '',
		hopeDate: '',
		hopePos: '',
		regionRank: [],
		skillRank: [],
		salaryList: []
	},
	getters: {
		isReady: state => state.isReady,
		hopeSalary: state => state.hopeSalary,
		hopeCity: state => state.hopeCity,
		hopeType: state => state.hopeType,
		hopeDate: state => state.hopeDate,
		hopePos: state => state.hopePos,
		regionRank: state => state.regionRank,
		skillRank: state => state.skillRank,
		salaryList: state => state.salaryList
	},
	mutations: {
		SET_READY: (state, isReady) => {
			state.isReady = isReady
		},
		SET_HOPESALARY: (state, hopeSalary) => {
			state.hopeSalary = hopeSalary
		},
		SET_HOPECITY: (state, hopeCity) => {
			state.hopeCity = hopeCity
		},
		SET_HOPETYPE: (state, hopeType) => {
			state.hopeType = hopeType
		},
		SET_HOPEDATE: (state, hopeDate) => {
			state.hopeDate = hopeDate
		},
		SET_HOPEPOS: (state, hopePos) => {
			state.hopePos = hopePos
		},
		SET_REGIONRANK: (state, regionRank) => {
			state.regionRank = regionRank
		},
		SET_SKILLRANK: (state, skillRank) => {
			state.skillRank = skillRank
		},
		SET_SALARYLIST: (state, salaryList) => {
			state.salaryList = salaryList
		}
	},
	actions: {
		async setHopeData({ commit }, hopeData) {
			switch(hopeData.type){
				case 'hopeSalary':
					commit('SET_HOPESALARY', hopeData.data)
					break;
				case 'hopeCity':
					commit('SET_HOPECITY', hopeData.data)
					break;
				case 'hopeType':
					commit('SET_HOPETYPE', hopeData.data)
					break;
				case 'hopeDate':
					commit('SET_HOPEDATE', hopeData.data)
					break;
				case 'hopePos':
					commit('SET_HOPEPOS', hopeData.data)
					break;
				case 'noHope':
					let regionRes = await getProvinceRank()
					let skillRes = await getRegionRank()
					commit('SET_REGIONRANK', TopFiveDate(regionRes.data))
					commit('SET_SKILLRANK', TopFiveDate(skillRes.data.skill))
					let salaryRes = await getPosSalary()
					commit('SET_SALARYLIST', salaryRes.data)
						
			}
		},
		async setReady({ commit }, hopeObj) {
			let pos = hopeObj.hopePos.split('-')[0]
			let city = hopeObj.hopeCity

			let salaryRes
			let regionRes
			let skillRes
			let res
			if(pos && city) {
				salaryRes = await getPosSalary({level: 3, region: city, position: pos})
				res = await getRegionRank({level: 3, region: city, position: pos})
				if(res.data.hotRegion) {
					//nothing
				}else {
					res = await getRegionRank({ level: 3, region: city })
				}
				commit('SET_REGIONRANK', res.data.hotRegion)
				commit('SET_SKILLRANK', TopFiveDate(res.data.skill))
			}else if(pos && !city ) {
				salaryRes = await getPosSalary({position: pos})
				res = await getRegionRank({position: pos})
				if(res.data.hotRegion) {
					commit('SET_REGIONRANK', res.data.hotRegion)
					commit('SET_SKILLRANK', TopFiveDate(res.data.skill))
				}else {
					regionRes = await getProvinceRank()
					skillRes = await getRegionRank()
					salaryRes = await getPosSalary()
					commit('SET_REGIONRANK', TopFiveDate(regionRes.data))
					commit('SET_SKILLRANK', TopFiveDate(skillRes.data.skill))
				}
				
			}else if(!pos && city) {
				salaryRes = await getPosSalary({level: 3, region: city})
				res = await getRegionRank({level: 3, region: city})
				commit('SET_REGIONRANK', res.data.hotRegion)
				commit('SET_SKILLRANK', TopFiveDate(res.data.skill))
			}else if(!pos && !city) {
				regionRes = await getProvinceRank()
				skillRes = await getRegionRank()
				salaryRes = await getPosSalary()
				commit('SET_REGIONRANK', TopFiveDate(regionRes.data))
				commit('SET_SKILLRANK', TopFiveDate(skillRes.data.skill))
			}
			commit('SET_SALARYLIST', salaryRes.data)
		}
	}
}

export default hope