<template>
    <div
        class="single"
        :style="{
            backgroundColor: `rgba(${data.color[0]}, ${data.color[1]}, ${data.color[2]}, 0.55)`
        }"
        v-on:click.stop="show"
    >
        <div class="singleTop">
            <div class="singleCover">
                <img :src="data.cover"/>
            </div>
            <div class="singleInfo">
                <div class="singleOperate">
                    <img
                        class="singleOperateLike"
                        :src="`../pic/${isThisLiked ?
                            'liked' : 'like'}.svg`"
                        @click.stop="like"
                    />
                    <img
                        class="singleOperateToggle"
                        :src="isThisPlaying ?
                                '../pic/controller-pause.svg' :
                                '../pic/controller-play.svg'"
                        v-on:click.stop="play"
                    />
                </div>
                <p class="singleInfoName">{{ data.name }}</p>
                <p class="singleInfoArtist">{{ data.artist }}</p>
                <p class="singleInfoDate">
                    <img :src="'../pic/logo.png'"/>
                    <span>{{ data.recommender.replace('：', ':') }}</span>
                    <span> · </span>
                    <span>{{ `${data.date.toString().slice(0, 4)}-${data.date.toString().slice(4, 6)}-${data.date.toString().slice(6, 8)}` }}</span>
                </p>
            </div>
        </div>
        <div class="singleBottom">
            <p class="singleDescription">{{ data.description }}</p>
        </div>
    </div>
</template>


<script>
    import Vue from 'vue';


    export default {
        name: 'single',
        props: ['data', 'index', 'type', 'remote'],
        methods: {
            show: function () {
                this.$store.dispatch('changeView', {view: 'playingTrack'});
                if (!this.isThisPlaying) this.play()
            },
            play: function () {
                const state = this.$store.state;
                state.play.type === this.type &&
                state.play.index === this.index ?
                    this.$store.dispatch('toggle', 'play') :
                    this.$store.dispatch('play', Object.freeze({
                        type: this.type,
                        index: this.index
                    }))
            },
            like: function () {
                this.$store.dispatch('like', {
                    type: 'single',
                    data: {
                        id: this.data.single_id,
                        from: this.data.from_id,
                        liked: !this.isThisLiked
                    },
                    remote: this.remote
                })
            }
        },
        computed: {
            isThisPlaying: function () {
                const state = this.$store.state;
                return state.play.playing &&
                    state.play.type === this.type &&
                    state.play.index === this.index
            },
            isThisLiked: function () {
                return this.$store.state.user.likedTracks.includes(this.data.single_id)
            }
        }
    }
</script>


<style lang="sass">
    .single
        width: 47%
        height: auto
        margin-bottom: 50px
        cursor: pointer
        box-shadow: 0 10px 50px 0 rgba(0,0,0,0.50)
        text-align: left
        transition: all ease 600ms
        overflow: hidden

        &:hover
            transform: scale(1.05)
            box-shadow: none

        *
            cursor: pointer

    .singleTop
        width: 100%
        height: auto
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center

    .singleCover
        width: 50%
        height: auto

        & > img
            width: 100%
            height: auto
            box-shadow: 0 10px 50px 0 rgba(0,0,0,0.50)

    .singleInfo
        width: 46%
        height: 100%

        .singleOperate
            margin-bottom: 8px

            & > img
                width: 18px
                height: auto
                cursor: pointer
                transition: all ease 300ms
                opacity: 0.8

                &:hover
                    transform: scale(1)
                    opacity: 1

            .singleOperateLike
                margin-right: 15px

        .singleInfoName
            font-size: 1.2em
            margin-bottom: 1px
            width: 100%
            word-break: break-word

        .singleInfoArtist
            font-size: 0.9em
            opacity: 0.7
            margin-bottom: 8px
            font-weight: 400

        .singleInfoDate
            font-size: 0.6em
            font-weight: 400

            & > img
                width: 6%
                height: auto
                position: relative
                top: 1px
                margin-right: 2px

    .singleBottom
        width: 100%
        display: flex
        justify-items: center

    .singleDescription
        font-size: 0.8em
        width: calc(100% - 40px)
        margin: 15px 20px
        font-weight: 400

</style>