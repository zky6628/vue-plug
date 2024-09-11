<!--
 * 录音并上传
 * @module recorder
 * @author zhanghuan
 * @date 2021/02/28
-->
<template>
    <loading :loading="loading">
        <h1>{{tipMsg}}</h1>
        <button @click="onStartVoice">开始</button>
        <button @click="onEndVoice">结束</button>
        <button @click="onPlayAudio">播放</button>
        <button @click="upload">上传</button>
        <h2 v-show="isVoice">录音中...</h2>
        <div v-show="isFinished">
            <h2>当前音频:</h2>
            <audio id="audioVoice" controls autoplay></audio>
        </div>
    </loading>
</template>

<script>
    import Record from '@/utils/record-sdk'
    import apis from '../../urls/recorder'

    export default {
        name: "Recorder",
        data() {
            return {
                loading: false,
                isVoice: false,
                isFinished: false,
                tipMsg: '录音',
                audio: "",
                recorder: new Record(),
                audioFile: null,
            }
        },
        methods: {
            // 开始录音
            onStartVoice() {
                this.onStopAudio()
                this.isFinished = false;
                this.recorder.startRecord({
                    success: res => {
                        this.isVoice = true
                    },
                    error: e => {
                        this.isVoice = false
                        console.log(e)
                    }
                });
            },

            // 结束录音
            onEndVoice() {
                this.isFinished = false;
                this.recorder.stopRecord({
                    success: res => {
                        this.isVoice = false
                        //此处可以获取音频源文件(res)，用于上传等操作
                        // console.log('音频源文件', res)
                        this.audioFile = res
                    },
                    error: e => {
                        this.isVoice = false
                    }
                });
            },

            // 播放录音
            onPlayAudio() {
                this.isVoice = false
                this.isFinished = true;
                this.audio = document.getElementById("audioVoice");
                this.recorder.play(this.audio);
            },

            // 停止播放录音
            onStopAudio() {
                this.recorder.clear(this.audio);
            },

            // 上传
            upload() {
                this.loading = true;
                let formData = new FormData()
                formData.append("file", this.audioFile)
                this.$axios.post(apis.upload, formData).then(res => {
                    this.loading = false;
                    
                    if (res.code === 200) {
                        this.$message.success('上传成功')
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">

</style>