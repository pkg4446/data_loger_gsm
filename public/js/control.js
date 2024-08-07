window.addEventListener('load', fetchInitialData);
        
        function fetchInitialData() {
            fetch(window.location.protocol+"//"+window.location.host+"/user/config", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id    : localStorage.getItem('user'),
                    token : localStorage.getItem('token'),
                    dvid  : localStorage.getItem('device'),
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched initial data:', data);
                //populateForm(data);
            })
            .catch((error) => {
                console.error('Error fetching initial data:', error);
                alert('초기 데이터를 불러오는 데 실패했습니다.');
            });
        }

        function populateForm(data) {
            // 관수
            document.getElementById('water-hours').value = data.irrigation.water.hours;
            document.getElementById('water-minutes').value = data.irrigation.water.minutes;
            document.getElementById('nutrient-hours').value = data.irrigation.nutrient.hours;
            document.getElementById('nutrient-minutes').value = data.irrigation.nutrient.minutes;

            // 조명
            document.getElementById('light-a-start').value = data.lighting.a.start;
            document.getElementById('light-a-end').value = data.lighting.a.end;
            document.getElementById('light-b-start').value = data.lighting.b.start;
            document.getElementById('light-b-end').value = data.lighting.b.end;
            document.getElementById('light-c-start').value = data.lighting.c.start;
            document.getElementById('light-c-end').value = data.lighting.c.end;
            document.getElementById('light-d-start').value = data.lighting.d.start;
            document.getElementById('light-d-end').value = data.lighting.d.end;

            // 냉난방
            document.getElementById('target-temp').value = data.temperature.target;
            document.getElementById('temp-tolerance').value = data.temperature.tolerance;

            // 공조
            document.getElementById('internal-hours').value = data.airConditioning.internal.hours;
            document.getElementById('internal-minutes').value = data.airConditioning.internal.minutes;
            document.getElementById('external-hours').value = data.airConditioning.external.hours;
            document.getElementById('external-minutes').value = data.airConditioning.external.minutes;
        }

        function sendData(type, action) {
            let data = {
                id    : localStorage.getItem('user'),
                token : localStorage.getItem('token'),
                dvid  : localStorage.getItem('device'),
                type  : type
            }
            switch(type) {
                case 'irrigation':
                    data.data= [[document.getElementById('water-hours').value,document.getElementById('water-minutes').value],
                                  [document.getElementById('nutrient-hours').value,document.getElementById('nutrient-minutes').value]
                                ];
                    break;
                case 'lighting':
                    data.data=[[document.getElementById('light-a-start').value,document.getElementById('light-a-end').value],
                                [document.getElementById('light-b-start').value,document.getElementById('light-b-end').value],
                                [document.getElementById('light-c-start').value,document.getElementById('light-c-end').value],
                                [document.getElementById('light-d-start').value,document.getElementById('light-d-end').value]
                            ];
                    break;
                case 'temperature':
                    data.data = {
                                target: document.getElementById('target-temp').value,
                                tolerance: document.getElementById('temp-tolerance').value
                            };
                    break;
                case 'airConditioning':
                    data.data = [[document.getElementById('internal-hours').value,document.getElementById('internal-minutes').value],
                                [document.getElementById('external-hours').value,document.getElementById('external-minutes').value]
                            ];
                    break;
                case 'houseControl':
                    data.data = action;
                    break;
            }

            fetch(window.location.protocol+"//"+window.location.host+"/user/cmd", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                alert(`${type} 데이터가 성공적으로 전송되었습니다.`);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(`${type} 데이터 전송 중 오류가 발생했습니다.`);
            });
        }