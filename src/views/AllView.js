"use strict";

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
    Image,
    SectionList
} from "react-native";
import TitleBar from '../components/TitleBar';
import Utils from '../utils/Utils';
import {doDoing} from '../redux/actions/AndroidAction';
import Progress from '../components/ProgressComponent';
import {connect} from 'react-redux';
import commonStyles from "../styles/Common";
import ToastUtils from "../utils/ToastUtils";
import ProgressComponent from '../components/ProgressComponent';
import MyItem from '../components/MyItem';

let mCurPage;
let isFirstRefresh;
let thiz;

class AllView extends Component {

    componentWillMount() {
        thiz = this;
        mCurPage = 1;
    }

    componentDidMount() {
        isFirstRefresh = true;
        this._refreshing();
    }

    componentDidUpdate() {
        // if (this.props.android && this.props.android.data) {
        //     isFirst = false;
        // }
    }

    renderLoadingView() {
        return (
            <View>
                <TitleBar propsPara={this.props.navigation.navigate} title='All'/>
                <Progress visible={this.props.android.isRefreshing || this.props.android.isLoading}/>
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        return (
            <View style={[styles.container, commonStyles.bgColor]}>
                <TitleBar propsPara={this.props.navigation.navigate} title='All'/>
                <Text style={styles.errorText}>
                    网络连接出错,请检查后重试!
                </Text>
            </View>
        );
    }

    //点击列表点击每一行
    _clickItem(item, index) {
        // alert(item.desc)
        // alert(index)
        thiz.props.navigation.navigate('Details', {title: item.desc, url: item.url});
    }

    //返回itemView
    _renderItemView({item, index}) {

        switch (item.type) {
            case '福利':
                return (
                    <TouchableOpacity
                        style={[commonStyles.item, {height: Utils.getHeight(300)}]}
                        key={item.index}
                        activeOpacity={1}
                        onPress={() => this._clickItem(item, index)}>
                        <Image
                            source={{uri: item.url}}
                            indicator={ActivityIndicator}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}/>
                    </TouchableOpacity>
                );
                break;
            case '休息视频':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'休息视频'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )
                break;
            case '瞎推荐':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'瞎推荐'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )
                break;
            case 'Android':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'Android'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )
                break;
            case '前端':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'前端'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )
                break;
            case 'iOS':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'iOS'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )

                break;
            case '拓展资源':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'拓展资源'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )
                break;
            case 'App':
                return (
                    <MyItem
                        propsNavigate={this.props.navigation.navigate}
                        type={'App'}
                        key={item.index}
                        desc={item.desc}
                        who={item.who}
                        url={item.url}
                        publishedAt={item.publishedAt.substring(0,10)}
                    />
                )
                break;
        }

    }

    _renderSectionHeader(info) {
        return (
            <TouchableOpacity
                style={[commonStyles.item, {height: Utils.getHeight(67)}]}
                key={info.item.index}
                activeOpacity={1}
                onPress={() => this._clickItem(info.item, info.item.index)}>

                <Text
                    numberOfLines={1}
                    lineHeight={Utils.getHeight(20)}
                    style={commonStyles.itemTop}>
                    {info.item.index + '     ' + info.item.desc}</Text>

                <Text
                    numberOfLines={1}
                    lineHeight={Utils.getHeight(10)}
                    style={commonStyles.itemBottom}>⟨{info.item.who}⟩</Text>
            </TouchableOpacity>
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
            console.log('sssssssssssssssssssss1');
            return thiz._foot_no_loading();
        } else if (!thiz.props.android.isLoading) {
            console.log('sssssssssssssssssssss2');
            return thiz._foot_no_loading();
        } else {
            console.log('sssssssssssssssssssss3');
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
            type: 'all',
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
            type: 'all',
        };
        thiz
            .props
            .dispatch(doDoing(opt));
        console.log('xxxxxxxxxxxxxxxx加载更多');
    }

    _sourceData() {
        if (this.props.android && this.props.android.data) {
            // isFirst = false;
            return this.props.android.data
        } else {
            return null
        }
    }

    //此函数用于为给定的item生成一个不重复的key
    _keyExtractor = (item, index) => item._id;

    renderData() {
        console.log(this.props.android)
        return (
            <View style={[commonStyles.bgColor, commonStyles.flex1]}>
                <TitleBar propsPara={this.props.navigation.navigate} title='All'/>
                <FlatList
                    showsVerticalScrollIndicator={true}//是否显示垂直滚动条
                    showsHorizontalScrollIndicator={false}//是否显示水平滚动条
                    numColumns={1}//每行显示1个
                    enableEmptySections={true}//数据可以为空
                    style={[commonStyles.bgColor, commonStyles.flex1]}
                    data={this.props.android.data}
                    renderItem={this._renderItemView.bind(this)}
                    //renderSectionHeader={this._renderSectionHeader}
                    //ListHeaderComponent={this._header}
                    ListFooterComponent={this._footer}
                    //ItemSeparatorComponent={this._separator}
                    ListEmptyComponent={this._listEmptyComponent}
                    refreshing={false}
                    keyExtractor={this._keyExtractor}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.android.isRefreshing}
                            onRefresh={this._refreshing}//此处需要的是方法 _regreshing后面不能有()
                        />
                    }
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this._onload()//此处需要的是方法 用箭头函数也可以
                    }}
                    //如果设置了getItemLayout，那么renderItem的高度必须和这个高度一样，
                    // 否则加载一段列表后就会出现错乱和显示空白。
                    // getItemLayout={(data, index) => (
                    //     {length: Utils.getHeight(67), offset: Utils.getHeight(67) * index, index}
                    // )}
                />
            </View>
        );
    }

    render() {
        console.log('----this.props.android.status:' + this.props.android.status);
        //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素
        // 的距离时调用。原生的滚动事件会被作为参数传递。译注：当第一次渲染时，如果数据不足一屏（比如初始值是空的），
        // 这个事件也会被触发，请自行做标记过滤。 下面这个标记尚未彻底解决问题
        if (this.props.android.status == 'success') {
            isFirstRefresh = false;
        }
        if (this.props.android.status == 'error') {
            //请求失败view
            return this.renderErrorView();
        } else if (this.props.android.status == 'init') {
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
    },
    img: {
        height: Utils.getHeight(20),
        width: Utils.getWidth(20),
    },
    myView: {
        height: Utils.getHeight(40),
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },

});

//mapStateToProps的第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象。
function mapStateToProps(state) {
    const {android} = state;
    return {android}
}

export default connect(mapStateToProps)(AllView);