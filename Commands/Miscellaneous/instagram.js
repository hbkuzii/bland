const { EmbedBuilder, ContextMenuCommandAssertions } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    name: 'instagram',
    aliases : [ 'ig'],
    description: 'Get information on an Instagram account',
    parameters: ['username'],
    usage: '(username)',
    example: 'jamescharles',
    category: 'Miscellaneous',
    permissions: ['SendMessages'],
    async execute(message, args, client) {
        try {
            const username = String(args[0]).toLowerCase();
            message.channel.sendTyping();
            const user = await get_profile(username)
            console.log(user.display_name)
            const embed = new EmbedBuilder({
                author: {
                    name: message.member.displayName,
                    iconURL: message.member.displayAvatarURL(),
                },
                url: `https://www.instagram.com/${user.username}`,
                title: `${user.display_name !== user.username ? `${user.display_name} (@${user.username})` : `${user.username}`} ${user.statistics.verified ? '☑️' : ''} ${user.statistics.private ? ':lock:' : ''}`,
                description: user.description
            });
            
            embed.addFields([
                {
                    name: 'Posts',
                    value: user.statistics.posts.toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Followers',
                    value: user.statistics.followers.toLocaleString(),
                    inline: true,
                },
                {
                    name: 'Following',
                    value: user.statistics.following.toLocaleString(),
                    inline: true,
                },
            ]);
            
            embed.setThumbnail(user.avatar_url);
            

            embed.setColor(config.color);

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error)
            return ctx.error()
        }
    }
};

async function serverRevision() {
  const response = await axios.get(
    'https://www.instagram.com/accounts/login/',
    { responseType: 'text' }
  );
  const text = response.data;

  const serverIdMatches = text.match(/server_revision":(\d*)/);
  const appIdMatches = text.match(/appId":"(\d*)/);

  if (!serverIdMatches || !appIdMatches) {
    throw new Error('Failed to retrieve server revision');
  }

  const serverId = serverIdMatches[1];
  const appId = appIdMatches[1];

  return { server_id: serverId, app_id: appId };
}

async function get_profile (username) {
  const { server_id, app_id } = await serverRevision();

  const response = await axios.get(
      'https://i.instagram.com/api/v1/users/web_profile_info/',
      {
        params: { username: username },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) 20100101 Firefox/103.0',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.3',
          DNT: '1',
          Origin: 'https://www.instagram.com',
          Referer: `https://www.instagram.com/${username}/`,
          Connection: 'keep-alive',
          'Alt-Used': 'i.instagram.com',
          'Sec-GPC': '1',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'X-Instagram-AJAX': server_id,
          'X-IG-App-ID': app_id,
          'X-ASBD-ID': '198337',
          'X-IG-WWW-Claim': '0'
        }
      }
    );
  
    const data = response.data;
    const user = data.data.user;
  
    return {
      id: user.id,
      username: user.username,
      display_name: user.full_name,
      description: user.biography,
      avatar_url: user.profile_pic_url_hd,
      statistics: {
        verified: user.is_verified,
        private: user.is_private,
        posts: user.edge_owner_to_timeline_media.count,
        followers: user.edge_followed_by.count,
        following: user.edge_follow.count
      }
    };
}