<!--
 * 首页
 * @module home
 * @author zhanghuan
 * @date 2021/01/30
-->
<template>
    <div class="home">
        <div class="nav-bg"></div>
        <div class="container">
            <div class="logo">ZhangHuanTest</div>
            <van-form @submit="onSubmit">
                <div class="top-container zh-card">
                    <div class="card-view">
                        <img alt="拍照" :src="cardView" />
                        <span>证件识别</span>
                    </div>

                    <van-field class="form-field" v-model="name" name="name" label="姓名" placeholder="请与身份证保持一致" :rules="[{ required: true, message: '请填写姓名' }]" />

                    <van-field class="form-field" readonly clickable name="picker" :value="cardType" label="证件类型" placeholder="点击选择证件" right-icon="arrow" @click="showFieldPicker('cardType')" />

                    <van-field class="form-field" v-model="number" name="number" label="证件号" placeholder="请输入证件号" :rules="[{ required: true, message: '请输入证件号' }]" />

                    <van-field class="form-field" v-model="age" type="number" name="age" label="年龄" placeholder="请输入年龄" :rules="[{ required: true, message: '请输入年龄' }]" />

                    <van-field class="form-field" readonly clickable name="picker" :value="sex" label="性别" placeholder="点击选择性别" right-icon="arrow" @click="showFieldPicker('sex')" />
                </div>


                <van-cell title="选择单个日期" :value="date" @click="show = true" />
                <van-calendar v-model="show" @confirm="onConfirm2" color="#529a34" :formatter="formatter">
                    <div slot="footer">哈哈</div>
                </van-calendar>

                <!-- 公用弹出选择 -->
                <van-popup v-model="showPicker" position="bottom">
                    <van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
                </van-popup>

                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">提交</van-button>
                </div>
            </van-form>

        </div>
    </div>
</template>

<script>
    import cardView from '@/assets/card-view.png'

    export default {
        name: "home",
        data() {
            return {
                cardView,
                currField: '',
                columns: [], // 共用
                name: '',
                cardType: '身份证',
                cardType_columns: ['身份证', '护照', '驾照'],
                showPicker: false,
                number: '',
                age: '',
                sex: '',
                sex_columns: ['男', '女', '保密'],

                date: '',
                show: false,

            }
        },
        methods: {
            /**
             * 提交表单
             * @method onSubmit
             * @for home
             * @param {object} values 表单值
             * @return {} 
             */
            onSubmit(values) {
                console.log('submit', values);
            },
            /**
             * 显示某个字段的选择框
             * @method showFieldPicker
             * @for home
             * @param {string} field 字段
             * @return {} 
             */
            showFieldPicker(field) {
                this.currField = field
                this.$set(this, 'columns', this[field + '_columns'])
                this.showPicker = true
            },
            /**
             * 赋值字段的选择
             * @method onConfirm
             * @for home
             * @param {string} field 字段
             * @return {} 
             */
            onConfirm(value) {
                this[this.currField] = value
                this.showPicker = false
            },

            formatDate(date) {
                return `${date.getMonth() + 1}/${date.getDate()}`;
            },
            onConfirm2(date) {
                this.show = false;
                this.date = this.formatDate(date);
            },
            formatter(day) {
                const weekDay = day.date.getDay()
                if (weekDay === 0 || weekDay === 6) {
                    day.text = <span style="color:  #529a34;">{day.text}</span>
                }
                return day;
            },
        }
    }
</script>

<style scoped lang="less">
    .home {
        position: relative;
        background: #fff;

        .nav-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(380px / 2);
            background: linear-gradient(to right, #78be5a, #529a34);
        }

        .container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }

        .logo {
            height: calc(150px / 2);
            line-height: calc(150px / 2);
            font-size: 20px;
            color: #fff;
            text-align: center;
        }

        .top-container {
            padding: 15px;
            margin: 0 16px 16px;

            .card-view {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 48px;
                border-radius: 4px;
                background: #f8f8f8;

                img {
                    width: 18px;
                    margin: 8px;
                }
            }
        }

        .form-field {
            margin: 5px 0;
        }
    }
</style>