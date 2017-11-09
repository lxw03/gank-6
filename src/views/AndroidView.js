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
} from "react-native";
import TitleBar from '../components/TitleBar';
import Utils from '../utils/Utils';
import {doDoing} from '../actions/AndroidAction';
import Progress from '../components/ProgressComponent';
import {connect} from 'react-redux';
import commonStyles from "../styles/Common";
import ToastUtils from "../utils/ToastUtils";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
let mCurPage;
let isFirst = true;
let thiz;

class AndroidView extends Component {

    componentWillMount() {
        thiz = this;
        mCurPage = 1;
    }

    componentDidMount() {
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
                <TitleBar propsPara={this.props.navigation.navigate} title='Android'/>
                <Progress visible={this.props.android.isRefreshing||this.props.android.isLoading}/>
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        return (
            <View style={[styles.container, commonStyles.bgColor]}>
                <TitleBar propsPara={this.props.navigation.navigate} title='Android'/>
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
    }

    //返回itemView
    _renderItemView({item, index}) {
        return (
            <TouchableOpacity
                style={commonStyles.item}
                key={item.index}
                activeOpacity={1}
                onPress={() => this._clickItem(item, index)}>

                <Text
                    numberOfLines={2}
                    lineHeight={Utils.getHeight(20)}
                    style={commonStyles.itemTop}>{index + '     '+item.desc}</Text>

                <Text
                    numberOfLines={1}
                    lineHeight={Utils.getHeight(10)}
                    style={commonStyles.itemBottom}>⟨{item.who}⟩</Text>
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
                <TitleBar propsPara={this.props.navigation.navigate} title='Android'/>
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
                            refreshing={this.props.android.isRefreshing}
                            onRefresh={this._refreshing}//此处需要的是方法 _regreshing后面不能有()
                        />
                    }
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                        this._onload()//此处需要的是方法 用箭头函数也可以
                    }}
                    getItemLayout={(data, index) => (
                        {length: Utils.getHeight(67), offset: Utils.getHeight(67) * index, index}
                    )}
                />
            </View>
        );
    }

    render() {
        console.log('----this.props.android.status:' + this.props.android.status);
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
    }

});

//mapStateToProps的第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象。
function mapStateToProps(state) {
    const {android} = state;
    return {android}
}

export default connect(mapStateToProps)(AndroidView);