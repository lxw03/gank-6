'use strict';

import Types from '../actions/Types'; // 导入事件类别,用来做事件类别的判断

// 初始状态

const initialState = {
    status: 'init',
    isSuccess: false,
    data: null,
    isRefreshing:false,
    isLoading:false,
}
// 不同类别的事件使用switch对应处理过程

export default function loginIn(state = initialState, action) {
    switch (action.type) {
        case Types.all.ALL_DOING:
            console.log('reducers all: doing');
            return {
                ...state,
                status: 'doing',
                isSuccess: false,
                data: action.data,
                isRefreshing:action.isRefreshing,
                isLoading:action.isLoading,
            }
            break;
        case Types.all.ALL_DONE:
            console.log('reducers all: success');
            return {
                ...state,
                status: 'success',
                isSuccess: true,
                data: action.data,
                isRefreshing:false,
                isLoading:false,
            }
            break;
        case Types.all.ALL_ERROR:
            console.log('reducers all: error');
            return {
                ...state,
                status: 'error',
                isSuccess: false,
                data: action.data,
                isRefreshing:false,
                isLoading:false,
            }
            break;
        default:
            console.log('reducers all: default');
            return state;

    }
}