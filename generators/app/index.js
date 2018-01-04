'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const figlet = require('figlet');
const fs = require('fs');
const asciitree = require('ascii-tree');
const ejs = require('ejs');
const _ = require('lodash');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('init', {
      description: 'Initialize the `.yo-rc.json` file in the current folder.',
      type: Boolean,
      alias: 'i',
      default: false
    });

    this.option('skip-test', {
      description: 'Skip the creation of the component spec file.',
      type: Boolean,
      alias: 't',
      default: false
    });

  }

  prompting() {
    // Greet the user.
    this.log(chalk.green(figlet.textSync('Altria')));
    // Default prompts object
    let prompts = [];
    // If initalize is called prompt user to save path and properties of `.yo-rc.json` file.
    if (this.options['init']) {
      // Ask for components path and sass common variables path.
      prompts = [{
        type: 'input',
        name: 'componentsGroup',
        message: 'Component Group (Used by AEM): ',
        default: 'ALTRIA'
      },{
          type: 'input',
          name: 'componentsPath',
          message: 'Components path: ',
          default: 'src/app/components/'
        },
        {
          type: 'input',
          name: 'componentsSassPath',
          message: 'Common Sass variable path (Relative to components path): ',
          default: '../sass/common.scss'
        }
      ];
      // Let the use know we are initalizing the config file.
      this.log(chalk.bold.bgBlue(' Altria Component Initialization \n'));
      return this.prompt(prompts).then(props => {
        this.props = props;
      });

    } else {
      // Ask for component name, description and whether it is responsive.
      prompts = [{
          type: 'input',
          name: 'compName',
          message: 'Component name: ',
          validate: function (input) {
            var done = this.async();
            if (_.trim(input) === '') {
              return done(chalk.red.bold('Error: ') + chalk.yellow.bold('You need to provide a component name!'));
            }
            return done(null, true);
          }
        },
        {
          type: 'input',
          name: 'compDesc',
          message: 'Component Description: ',
          validate: function (input) {
            var done = this.async();
            if (_.trim(input) === '') {
              return done(chalk.bold.red('Error: ') + chalk.bold.yellow('You need to provide a component description!'));
            }
            return done(null, true);
          }
        },
        {
          type: 'confirm',
          name: 'isResponsive',
          message: 'Is Component Responsive? ',
          default: true
        },
        {
          type: 'confirm',
          name: 'isPathCorrect',
          message: 'Do you want to create the files in ' + chalk.bold.yellow(this.config.get('componentsPath')) + '? ',
          default: true,
          when: function (response) {
            return this.config.get('componentsPath');
          }.bind(this)
        },
        {
          name: 'componentsPath',
          message: 'Please enter the component path: ',
          when: function (response) {
            return !response.isPathCorrect;
          },
          validate: function (input) {
            var done = this.async();
            if (_.trim(input) === '') {
              return done(chalk.bold.red('Error: ') + chalk.bold.yellow('You need to provide a component path!'));
            }
            return done(null, true);
          }
        }
      ];
      //Let the user know that you are generating a component.
      this.log(chalk.bold.bgBlue(' Altria Component Generator \n'));
      return this.prompt(prompts).then(props => {
        this.props = props;
        this.props.componentsGroup = this.config.get('componentsGroup') || 'ALTRIA';
        this.props.componentsSassPath = this.config.get('componentsSassPath');
        this.props.skipTest = this.options['skip-test'];
        if (!this.props.isPathCorrect) {
          this.config.set('componentsPath', this.props.componentsPath);
        }
        this._formatComponentName();
        this._createComponentAsciiTree();
      });
    }
  }

  writing() {
    if (this.options['init']) {
      this._updateYoConfigFile();
    } else {
      this._moveTemplates(['json', 'hbs', 'js', 'scss'], true);
      this._moveTemplates(['README.md']);
      // Skip the spec file generation if flag is set
      if (!this.options['skip-test']) {
        this._moveTemplates(['spec.js'], true);
      }
      // Move the resposive sass files to the component
      if(this.props.isResponsive){
        this._moveTemplates(['sass']);
      }
    }
  }

  install() {}

  _updateYoConfigFile() {
    this.log(chalk.bold.blue('Saving `.yo-rc.json` file..'));
    this.config.set('componentsPath', this.props.componentsPath);
    this.config.set('componentsSassPath', this.props.componentsSassPath);
    this.log(chalk.bold.green('Saved!'));
  }

  _formatComponentName() {
    this.props.compName = _.camelCase(_.trim(this.props.compName));
    this.props.compNameFile = _.kebabCase(this.props.compName);
    this.props.compNamePretty = _.startCase(this.props.compName);
    this.props.compNameClass = this.props.compNamePretty.split(' ').join('');
    return this.props;
  }

  _createComponentAsciiTree() {
    // Create the directory tree from component.structure.txt
    var str = fs.readFileSync(this.templatePath('component.structure.txt'), 'utf8');
    this.props.compTree = asciitree.generate(ejs.render(str, this.props));
    return this.props;
  }

  _moveTemplates(fileExtOrFolders, isExtension) {
    if (_.isArray(fileExtOrFolders)) {
      for (let i = 0; i < fileExtOrFolders.length; i++) {
        this._moveTemplates(fileExtOrFolders[i], isExtension);
      }
    } else if (_.isString(fileExtOrFolders)) {
      if (isExtension) {
        if( fileExtOrFolders === 'scss') {
          this.fs.copyTpl(
            this.templatePath('component.' + fileExtOrFolders),
            this.destinationPath(path.join(this.config.get('componentsPath'), this.props.compNameFile, 'sass/index.' + fileExtOrFolders)),
            this.props
          );
        }
        else if( fileExtOrFolders === 'js') {
          this.fs.copyTpl(
            this.templatePath('component.' + fileExtOrFolders),
            this.destinationPath(path.join(this.config.get('componentsPath'), this.props.compNameFile, '/index.' + fileExtOrFolders)),
            this.props
          );
        }
        else {
          this.fs.copyTpl(
            this.templatePath('component.' + fileExtOrFolders),
            this.destinationPath(path.join(this.config.get('componentsPath'), this.props.compNameFile, this.props.compNameFile + '.' + fileExtOrFolders)),
            this.props
          );
        }
      } else {
        this.fs.copyTpl(
          this.templatePath(fileExtOrFolders),
          this.destinationPath(path.join(this.config.get('componentsPath'), this.props.compNameFile, fileExtOrFolders)),
          this.props
        );
      }
    }
  }
};
