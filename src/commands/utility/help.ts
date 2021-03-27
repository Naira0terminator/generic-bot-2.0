import { Command, CommandOptions } from 'discord-akairo';
import ms from 'ms';
import { Message } from 'discord.js';
import { prefix } from '../../config.json';

export default class HelpCommand extends Command {
	constructor () {
		super('help', {
			aliases: ['help', 'h', 'commands'],
			args: [
				{
					id: 'command',
					type: 'commandAlias',
					default: null
				}
			],
			description: {
				content: 'Displays information about a command',
				usage: '[command]',
				examples: ['ping']
			}
		});
	}

	async exec (message: Message, { command }: { command: CommandOptions}) {
        
		if(command) {
			const embed = this.client.util.embed();
			if(command.ownerOnly === true && message.author.id !== this.client.ownerID) return message.reply('this command is only usable by the owner!');
			embed
			.setTitle(command.aliases![0])
			.setColor('RANDOM')
			.addField(
				'❯ Description',
				command.description.content || command.description || 'A cool command without a description.')
			.addField('❯ Cooldown:', ms(command.cooldown || this.handler.defaultCooldown, {long: true}) || 'no cooldown', true);
			if (command.aliases!.length > 1) {
				embed.addField('❯ Aliases', `\`${command.aliases!.join('`, `')}\``);
			}
			if(command.description.usage) {
				embed.addField('❯ usage:', `<prefix>${command.aliases![0]} ${command.description.usage ? command.description.usage : ''}`)
			}
			if (command.description.examples && command.description.examples.length) {
				embed.addField(
				'❯ Examples',
				`<prefix>${command.aliases![0]} ${command.description.examples.join(`\n<prefix>${command.aliases![0]} `)}`)
			}
			return message.channel.send(embed);
		}

		else {

			const catSize = (catagory: string) => this.handler.categories.get(catagory)?.size;
			let msg: Message;

			try {
				msg = await message.author.send(this.client.util.embed()
				.setTitle('Commands list')
				.setDescription(`**Default prefix**: \`${prefix}\` or you can mention me.
				\n\`\`\`diff\n-click on the macthing Emoji reaction to see the commands list for that catagory!\`\`\`\n`)
				.setFooter(`total commands: ${this.handler.modules.size}`)
				.setColor('RANDOM')
				.addField(`🎉 | Fun - \`${catSize('Fun')}\``,
				'❃ - Fun commands to mess around with like getting a random meme or seeing how gay you are.')
				.addField(`🔨 | Moderation - \`${catSize('moderation')}\``, 
				'❃ - Reliable commands to help moderate your server with built in message logging for most moderation actions!')
				.addField(`🎵 | Muisc - \`${catSize('Music')}\``,
				'❃ - Full music module (only supports youtube currently)')
				.addField(`🔧 | Settings - \`${catSize('settings')}\``,
				'❃ - Commands to help you setup the bots many features. only useful for server admins')
				.addField(`💾 | Utiliy - \`${catSize('utility')}\``,
				'❃ - Useful utility commands like image search reminders and an embed builder!')
				);
			} catch(err) {
				return message.reply('i could not dm you. you might have me blocked or your dms might be closed!');
			}

			if(message.guild)
				await message.reply('i have dmed you with a full list of my commands!');

			await msg.react('🎉');
			await msg.react('🔨');
			await msg.react('🎵');
			await msg.react('🔧');
			await msg.react('💾');

			const collector = msg.createReactionCollector((r, u) => ['🎉', '🔨', '🎵', '🔧', '💾'].includes(r.emoji.name) && u.id === message.author.id, {time: 90000});
			
			collector.on('collect', async r => {

				switch(r.emoji.name) {
					case '🎉':
						await msg.edit(constructEmbed('Fun'));
					break;
					case '🔨':
						await msg.edit(constructEmbed('moderation'));
					break;
					case '🎵':
						await msg.edit(constructEmbed('Music'));
					break;
					case '🎵':
						await msg.edit(constructEmbed('Music'));
					break;
					case '🔧':
						await msg.edit(constructEmbed('settings'));
					break;
					case '💾':
						await msg.edit(constructEmbed('utility'));
					break;
				}

				//r.users.remove(message.author.id);
			});

			collector.on('end', async () => {
				//await msg.reactions.removeAll();
				return await msg.edit('message is now inactive!');
			});

			let client = this.client;
			let handler = this.handler;
			function constructEmbed(catagory: string) {
				const getCat = handler.categories.get(catagory);
				const embed = client.util.embed()
				.setTitle(getCat)
				.setAuthor('to get extra information on any command write <prefix>help command_name')
				.setColor('RANDOM')
				.setDescription(getCat?.map(cmd => `❃ - \`${cmd.aliases[0]}\`: ${cmd.description.content || cmd.description || "No description"}\n`))
				.setFooter('Use .help command_name to get extra information on any command')
				return embed;
			}
		}
	}
}