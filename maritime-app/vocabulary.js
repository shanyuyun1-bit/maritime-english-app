// 航海英语词汇数据库

const ALL_VOCABULARY = [
    // 通用航海术语
    { english: 'Port', pronunciation: '/pɔːrt/', category: '通用术语', part: 'n.', chinese: '港口', example: 'The ship is heading to the port.' },
    { english: 'Starboard', pronunciation: '/ˈstɑːrbərd/', category: '通用术语', part: 'n.', chinese: '右舷', example: 'Turn to starboard to avoid the rocks.' },
    { english: 'Bow', pronunciation: '/baʊ/', category: '通用术语', part: 'n.', chinese: '船头', example: 'The bow of the ship cuts through the water.' },
    { english: 'Stern', pronunciation: '/stɜːrn/', category: '通用术语', part: 'n.', chinese: '船尾', example: 'The captain stands at the stern.' },
    { english: 'Anchor', pronunciation: '/ˈæŋkər/', category: '通用术语', part: 'n.', chinese: '锚', example: 'Drop the anchor in the shallow water.' },
    { english: 'Deck', pronunciation: '/dek/', category: '通用术语', part: 'n.', chinese: '甲板', example: 'Sailors work on the deck.' },
    { english: 'Hull', pronunciation: '/hʌl/', category: '通用术语', part: 'n.', chinese: '船身', example: 'The hull is damaged by the collision.' },
    { english: 'Cargo', pronunciation: '/ˈkɑːrɡoʊ/', category: '通用术语', part: 'n.', chinese: '货物', example: 'The ship is loaded with cargo.' },
    { english: 'Crew', pronunciation: '/kruː/', category: '通用术语', part: 'n.', chinese: '船员', example: 'The crew of 50 sailed across the ocean.' },
    { english: 'Navigation', pronunciation: '/ˌnævɪˈɡeɪʃn/', category: '通用术语', part: 'n.', chinese: '航行', example: 'Modern navigation uses GPS technology.' },

    // 天气和海况
    { english: 'Storm', pronunciation: '/stɔːrm/', category: '天气条件', part: 'n.', chinese: '风暴', example: 'A severe storm is approaching.' },
    { english: 'Wave', pronunciation: '/weɪv/', category: '天气条件', part: 'n.', chinese: '波浪', example: 'Large waves can damage the ship.' },
    { english: 'Wind', pronunciation: '/wɪnd/', category: '天气条件', part: 'n.', chinese: '风', example: 'The wind speed is 30 knots.' },
    { english: 'Fog', pronunciation: '/fɔːɡ/', category: '天气条件', part: 'n.', chinese: '雾', example: 'Dense fog reduced visibility to 100 meters.' },
    { english: 'Tide', pronunciation: '/taɪd/', category: '天气条件', part: 'n.', chinese: '潮汐', example: 'High tide occurs twice a day.' },
    { english: 'Current', pronunciation: '/ˈkɜːrənt/', category: '天气条件', part: 'n.', chinese: '洋流', example: 'The current is strong in this area.' },
    { english: 'Reef', pronunciation: '/riːf/', category: '天气条件', part: 'n.', chinese: '礁石', example: 'Avoid the coral reef.' },
    { english: 'Squall', pronunciation: '/skwɔːl/', category: '天气条件', part: 'n.', chinese: '风暴', example: 'A sudden squall struck the ship.' },

    // 船舶操作
    { english: 'Hoist', pronunciation: '/hɔɪst/', category: '船舶操作', part: 'v.', chinese: '升起', example: 'Hoist the sails to catch the wind.' },
    { english: 'Lower', pronunciation: '/ˈloʊər/', category: '船舶操作', part: 'v.', chinese: '放低', example: 'Lower the lifeboat.' },
    { english: 'Moor', pronunciation: '/mɔːr/', category: '船舶操作', part: 'v.', chinese: '系泊', example: 'Moor the ship at the dock.' },
    { english: 'Dock', pronunciation: '/dɑːk/', category: '船舶操作', part: 'v.', chinese: '停靠', example: 'The ship will dock in two hours.' },
    { english: 'Berth', pronunciation: '/bɜːrθ/', category: '船舶操作', part: 'n.', chinese: '泊位', example: 'We need to find a berth for the ship.' },
    { english: 'Helm', pronunciation: '/helm/', category: '船舶操作', part: 'n.', chinese: '舵', example: 'Take the helm and steer the ship.' },
    { english: 'Steer', pronunciation: '/stɪr/', category: '船舶操作', part: 'v.', chinese: '操舵', example: 'Steer north by the compass.' },
    { english: 'Course', pronunciation: '/kɔːrs/', category: '船舶操作', part: 'n.', chinese: '航向', example: 'Change course to avoid the storm.' },

    // 紧急情况
    { english: 'Distress', pronunciation: '/dɪˈstres/', category: '紧急情况', part: 'n.', chinese: '遇险', example: 'Send a distress signal immediately.' },
    { english: 'Abandon ship', pronunciation: '/əˈbændən ʃɪp/', category: '紧急情况', part: 'phrase', chinese: '弃船', example: 'The captain ordered to abandon ship.' },
    { english: 'Lifeboat', pronunciation: '/ˈlaɪfboʊt/', category: '紧急情况', part: 'n.', chinese: '救生艇', example: 'Get to the lifeboat immediately.' },
    { english: 'Rescue', pronunciation: '/ˈreskjuː/', category: '紧急情况', part: 'n.', chinese: '救援', example: 'The rescue team arrived within minutes.' },
    { english: 'Collision', pronunciation: '/kəˈlɪʒn/', category: '紧急情况', part: 'n.', chinese: '碰撞', example: 'There was a collision near the harbor.' },
    { english: 'Leak', pronunciation: '/liːk/', category: '紧急情况', part: 'n.', chinese: '漏水', example: 'The hull has a serious leak.' },
    { english: 'Injury', pronunciation: '/ˈɪndʒəri/', category: '紧急情况', part: 'n.', chinese: '受伤', example: 'There are several crew members with injuries.' },
    { english: 'Medical', pronunciation: '/ˈmedɪkl/', category: '紧急情况', part: 'adj.', chinese: '医疗的', example: 'We need medical assistance immediately.' },

    // 通讯术语
    { english: 'Radio', pronunciation: '/ˈreɪdioʊ/', category: '通讯术语', part: 'n.', chinese: '无线电', example: 'Contact the harbor by radio.' },
    { english: 'Channel', pronunciation: '/ˈtʃænl/', category: '通讯术语', part: 'n.', chinese: '频道', example: 'Switch to Channel 16 for emergencies.' },
    { english: 'Transmit', pronunciation: '/trænzˈmɪt/', category: '通讯术语', part: 'v.', chinese: '传送', example: 'Transmit the message at once.' },
    { english: 'Receive', pronunciation: '/rɪˈsiːv/', category: '通讯术语', part: 'v.', chinese: '接收', example: 'We receive the signal clearly.' },
    { english: 'Signal', pronunciation: '/ˈsɪɡnəl/', category: '通讯术语', part: 'n.', chinese: '信号', example: 'The signal is weak.' },
    { english: 'Message', pronunciation: '/ˈmesɪdʒ/', category: '通讯术语', part: 'n.', chinese: '信息', example: 'Important message from the captain.' },

    // 基础航海
    { english: 'Compass', pronunciation: '/ˈkʌmpəs/', category: '导航设备', part: 'n.', chinese: '指南针', example: 'Check the compass to verify the direction.' },
    { english: 'Chart', pronunciation: '/tʃɑːrt/', category: '导航设备', part: 'n.', chinese: '海图', example: 'Study the chart before sailing.' },
    { english: 'Latitude', pronunciation: '/ˈlætɪtuːd/', category: '导航设备', part: 'n.', chinese: '纬度', example: 'Our latitude is 40 degrees north.' },
    { english: 'Longitude', pronunciation: '/ˈlɑːndʒɪtuːd/', category: '导航设备', part: 'n.', chinese: '经度', example: 'Mark the longitude on the map.' },
    { english: 'Speed', pronunciation: '/spiːd/', category: '导航设备', part: 'n.', chinese: '速度', example: 'Reduce speed in shallow water.' },
    { english: 'Depth', pronunciation: '/depθ/', category: '导航设备', part: 'n.', chinese: '深度', example: 'Check the depth of the water.' }
];