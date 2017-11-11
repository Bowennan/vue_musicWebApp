import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRec() {
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		uni: 0,
		needNewCode: 1
	});

	return jsonp(url, data, options);
}

export function getMv() {
	const url = 'https://c.y.qq.com/v8/fcg-bin/getmv_by_tag'

	const data = Object.assign({}, commonParams, {
		loginUin:0,
		hostUin:0,
		platform:'yqq',
		needNewCode:0,
		cmd:'shoubo',
		lan:'all'
	})

	return jsonp(url, data, options);
}


export function getList() {
	const url = '/api/getList';

	const data = Object.assign({}, commonParams, {
		hostUin:0,
		platform:'yqq',
		needNewCode:0,
		categoryId:10000000,
		sortId:5,
		sin:0,
		ein:29,
		rnd: Math.random(),
		format: 'json'
	});

	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}