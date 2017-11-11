import * as types from './mutation-types'

const mutations = {
	[types.SET_SINGER](state, singer) {
		state.singer = singer
	},
	[types.SET_PLAYING_STATE](state,flag) {
		state.playing = flag
	},
	[types.SET_FULL_SCREEN](state,flag) {
        state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state, list){
		state.playList = list
	},
	[types.SET_SEQUENCE_LIST](state, list) {
		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state, statenum) {
		state.mode = statenum
	},
	[types.SET_CURRENT_INDEX](state, indexnum) {
		state.currentIndex = indexnum
	}
}

export default mutations