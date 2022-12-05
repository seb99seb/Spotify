Vue.createApp({
    data() {
        return {
            clientId: '849bcded0aa04ffa855b5bd3381c7284',
            clientSecret: '25bed5e8f08a43ac9f914b920dae2b4b',
            scopes: "user-read-playback-state playlist-read-private user-modify-playback-state",
            redirectURI: "http://localhost:5501/",
            deviceId: "",
            auth: "",
            token: "",
            xhr: "",
            userId: "31kqpkdzy6346fcuw6jh6tom5a3e",
            settingPlaylist: false,
            logginIn: false,
            tokenDone: false,
            deviceIdDone: false,
            myPlaylists: [],
            mood: "",
            PL: "",
            notSelected: false,
            selected: false
        }
    },
    methods: {
        fetchAccessToken(){
            let body = 'grant_type=authorization_code'
            body += '&code=' + this.auth
            body += '&redirect_uri=' + this.redirectURI
            body += '&client_id=' + this.clientId
            body += '&client_secret=' + this.clientSecret
            this.callAuthorizationApi(body)
        },
        callAuthorizationApi(body){
            this.xhr = new XMLHttpRequest()
            this.xhr.open('POST', 'https://accounts.spotify.com/api/token', true)
            this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            this.xhr.setRequestHeader('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret))
            this.xhr.send(body)
            this.xhr.onload = this.handleAuthorizationResponse
        },
        handleAuthorizationResponse(){
            var data = JSON.parse(this.xhr.responseText)
            this.token = data.access_token
            document.getElementById("getPL").click()
            this.tokenDone = true
            console.log(this.token)
        },
        async getDeviceId(){
            const result = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
                method: 'GET',
                headers: { 'Authorization' : 'Bearer ' + this.token}
            })
            const data = await result.json()
            this.deviceId = data.devices[0].id
            console.log('device id:'+this.deviceId)
            this.deviceIdDone = true
        },
        async playSong(){
            await this.getDeviceId()
            this.xhr = new XMLHttpRequest()
            this.xhr.open('PUT', 'https://api.spotify.com/v1/me/player/play?device_id='+this.deviceId, true)
            this.xhr.setRequestHeader('Content-Type', 'application/json')
            this.xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            this.xhr.send()
        },
        getPlaylists(){
            this.xhr = new XMLHttpRequest()
            var url = 'https://api.spotify.com/v1/users/' + this.userId + '/playlists?limit=40'
            this.xhr.open('GET', url, true)
            this.xhr.setRequestHeader('Content-Type', 'application/json')
            this.xhr.setRequestHeader('Authorization', 'Bearer ' + this.token)
            this.xhr.send()
            this.xhr.onload = this.handlePlayslists
        },
        handlePlayslists(){
            var data = JSON.parse(this.xhr.responseText)
            this.myPlaylists = data.items
        },
        cancelSettingPlaylist(){
            this.PL = ""
            this.mood = ""
            this.selected = false
            this.notSelected = false
            this.settingPlaylist = false
        },
        selection(){
            if (this.PL.length>0 && this.mood.length>0){
                this.selected = true
                this.notSelected = false
            }
            else{
                this.notSelected = true
                this.selected = false
            }
        },
        savePlaylistSQL(){

            //WIP
            var mysql = require('mysql')
            var con = mysql.createConnection({
                host: 'mssql6.unoeuro.com',
                user: 'embo_zealand_dk',
                password: 'h69BryFf5dGD'
            })
            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                });
        },
        getFragmentIdentifier(){
            const urlParams = new URLSearchParams(window.location.search);
            this.auth = urlParams.get('code');
            if (urlParams.get('code')!=null){
                this.logginIn=true
            }
        }
    }
}).mount("#app")