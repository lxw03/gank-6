'use strict';
import React, {Component} from "react";
import {
    Animated,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import TitleBar from '../components/TitleBar';
import Utils from '../utils/Utils';
import {doDoing} from '../redux/actions/IosAction';
import Progress from '../components/ProgressComponent';
import {connect} from 'react-redux';
import commonStyles from "../styles/Common";
import ToastUtils from "../utils/ToastUtils";
import ProgressComponent from '../components/ProgressComponent';
import MyItem from '../components/MyItem';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
let mCurPage;
let isFirstRefresh;
let thiz;

class IosView extends Component {

    componentWillMount() {
        thiz = this;
        mCurPage = 1;
    }

    componentDidMount() {
        isFirstRefresh = true;
        this._refreshing();
    }

    componentDidUpdate() {
        // if (this.props.ios && this.props.ios.data) {
        //     isFirst = false;
        // }
    }

    renderLoadingView() {
        return (
            <View>
                <TitleBar propsPara={this.props.navigation.navigate} title='ios'/>
                <Progress visible={this.props.ios.isRefreshing || this.props.ios.isLoading}/>
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        return (
            <View style={[styles.container, commonStyles.bgColor]}>
                <TitleBar propsPara={this.props.navigation.navigate} title='ios'/>
                <Text style={styles.errorText}>
                    网络连接出错,请检查后重试!
                </Text>
            </View>
        );
    }

    //返回itemView
    _renderItemView({item, index}) {
        return (
            <MyItem
                noImg={true}
                propsNavigate={this.props.navigation.navigate}
                url={item.url}
                key={item.index}
                desc={item.desc}
                who={item.who}
                publishedAt={item.publishedAt.substring(0,10)}
            />
        );
    }

    _header() {
        return (
            <View>
                <Text>header</Text>
            </View>
        );
    }

    _footer() {
        //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素
        // 的距离时调用。原生的滚动事件会被作为参数传递。译注：当第一次渲染时，如果数据不足一屏（比如初始值是空的），
        // 这个事件也会被触发，请自行做标记过滤。 下面这个标记尚未彻底解决问题 isFirstRefresh
        if (isFirstRefresh) {
            return thiz._foot_no_loading();
        } else if (!thiz.props.ios.isLoading) {
            return thiz._foot_no_loading();
        } else {
            return thiz._foot_loading();
        }
    }

    _foot_loading() {
        return (
            <View style={{height: Utils.getHeight(50), flex: 1}}>
                <ActivityIndicator
                    // color={this.props.color}
                    size="small"
                    style={{flex: 1}}
                />
            </View>
        );
    }

    _foot_no_loading() {
        return (
            <View style={{height: Utils.getHeight(50), flex: 1}}>
            </View>
        );
    }

    _separator() {
        return (
            <View style={commonStyles.separator}>
            </View>
        );
    }

    _listEmptyComponent() {
        return (
            <View style={[styles.container, commonStyles.bgColor]}>
                <Text style={[styles.emptyData, commonStyles.bgColor]}>
                    数据为空!
                </Text>
                <Text style={[styles.emptyData, commonStyles.bgColor]}/>
            </View>
        );
    }

    _refreshing() {
        mCurPage = 1;
        let opt = {
            num: mCurPage,
            isRefreshing: true,
            isLoading: false,
            type:'iOS',
        };
        thiz
            .props
            .dispatch(doDoing(opt));
        console.log('xxxxxxxxxxxxxxxx刷新成功');
    }

    _onload() {
        // ToastUtils.show('到达底部');
        mCurPage++;
        let opt = {
            num: mCurPage,
            isRefreshing: false,
            isLoading: true,
            type:'iOS',
        };
        thiz
            .props
            .dispatch(doDoing(opt));
        console.log('xxxxxxxxxxxxxxxx加载更多');
    }

    _sourceData() {
        if (this.props.ios && this.props.ios.data) {
            // isFirst = false;
            return this.props.ios.data
        } else {
            return null
        }
    }

    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item._id;

    renderData() {
        console.log(this.props.ios)
        return (
            <View style={[commonStyles.bgColor, commonStyles.flex1]}>
                <TitleBar propsPara={this.props.navigation.navigate} title='iOS'/>
                <FlatList
                    showsVerticalScrollIndicator={true}//是否显示垂直滚动条
                    showsHorizontalScrollIndicator={false}//是否显示水平滚动条
                    numColumns={1}//每行显示1个
                    enableEmptySections={true}//数据可以为空
                    style={[commonStyles.bgColor, commonStyles.flex1]}
                    data={this._sourceData()}
                    renderItem={this._renderItemView.bind(this)}
                    //ListHeaderComponent={this._header}
                    ListFooterComponent={this._footer}
                    //ItemSeparatorComponent={this._separator}
                    //ListEmptyComponent={this._listEmptyComponent}
                    // refreshing={false}
                    keyExtractor={this._keyExtractor}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.ios.isRefreshing}
                            onRefresh={this._refreshing}//此处需要的是方法 _regreshing后面不能有()
                        />
                    }
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this._onload()//此处需要的是方法 用箭头函数也可以
                    }}
                    //如果设置了getItemLayout，那么renderItem的高度必须和这个高度一样，
                    // 否则加载一段列表后就会出现错乱和显示空白。
                    getItemLayout={(data, index) => (
                        {length: Utils.getHeight(67), offset: Utils.getHeight(67) * index, index}
                    )}
                />
            </View>
        );
    }

    render() {
        console.log('----this.props.ios.status:' + this.props.ios.status);
        //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素
        // 的距离时调用。原生的滚动事件会被作为参数传递。译注：当第一次渲染时，如果数据不足一屏（比如初始值是空的），
        // 这个事件也会被触发，请自行做标记过滤。 下面这个标记尚未彻底解决问题
        if (this.props.ios.status == 'success') {
            isFirstRefresh = false;
        }
        if (this.props.ios.status == 'error') {
            //请求失败view
            return this.renderErrorView();
        } else if (this.props.ios.status == 'init') {
            return null;
        }
        //加载数据
        return this.renderData();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // position:'absolute'
    },
    errorText: {
        flex: 1,
        // position:'absolute',
        alignSelf: 'center',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: Utils.size.height / 5 * 2,
    },
    emptyData: {
        flex: 1,
        // position:'absolute',
        alignSelf: 'center',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: Utils.size.height / 5 * 2,
    },
    title: {
        fontSize: Utils.getFontSize(15),
        color: 'blue'
    },
    content: {
        fontSize: Utils.getFontSize(15),
        color: 'black'
    }

});

//mapStateToProps的第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象。
function mapStateToProps(state) {
    const {ios} = state;
    return {ios}
}

export default connect(mapStateToProps)(IosView);