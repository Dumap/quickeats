import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';


const styles = theme => ({
    main: {
      width: 'auto',
      display: 'block', 
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 420,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing.unit,
    },
    submit: {
        margin: theme.spacing.unit * 2,
        width: 350
    },
    formControl: {
        width: '160px',
        margin: theme.spacing.unit * 2,
    },
    group: {
        display: 'flex', 
        flexDirection: 'row'
    },
    member: {
        width: 'auto' 
    },
    label: {
        margin: theme.spacing.unit * 2,
        width: 350
    },
  });

class Filter extends Component {
    state = {
        radius: '',
        maxprice: '',
        rankby: '',
        opennow: false,
        keyword: ''
      };
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
      };
    render() {
        return (
            <main className={this.props.classes.main}>
              <CssBaseline />
              <Paper className={this.props.classes.paper}>
                <Typography component="h1" variant="h5">
                  Search Filters
                </Typography>
                <form className={this.props.classes.form}>
                <FormControl className={this.props.classes.formControl}>
                    <InputLabel>Range</InputLabel>
                    <Select
                        native
                        value={this.state.range}
                            onChange={this.handleChange('range')}
                            inputProps={{
                            name: 'range'
                        }}
                    >
                        <option value="" />
                        <option value={1000}>1 km</option>
                        <option value={2000}>2 km</option>
                        <option value={5000}>5 km</option>
                        <option value={10000}>10 km</option>
                    </Select>
                </FormControl>
                <FormControl margin="normal" className={this.props.classes.formControl}>
                    <InputLabel >Price</InputLabel>
                    <Select
                        native
                        autoWidth
                        value={this.state.price}
                            onChange={this.handleChange('price')}
                            inputProps={{
                            name: 'price',
                        }}
                    >
                        <option value="" />
                        <option value={1}>$</option>
                        <option value={2}>$$</option>
                        <option value={3}>$$$</option>
                        <option value={4}>$$$$</option>
                    </Select>
                </FormControl>
                    <FormLabel component="legend" 
                                className={this.props.classes.label}
                        >Rank by</FormLabel>
                    <RadioGroup
                        aria-label="rank"
                        name="rank"
                        className={this.props.classes.group}
                        value={this.state.rankby}
                        onChange={this.handleChange}
                        >
                        <FormControlLabel
                            value="prominence"
                            className={this.props.classes.member}
                            control={<Radio color="primary" />}
                            label="Prominence"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="distance"
                            className={this.props.classes.member}
                            control={<Radio color="primary" />}
                            label="Distance"
                            labelPlacement="start"
                        />
                    </RadioGroup>
                    <FormControl margin="normal" className={this.props.classes.label} fullWidth>
                        <InputLabel htmlFor="keyword">Key Word</InputLabel>
                        <Input id="keyword" name="keyword" />
                    </FormControl>
                    <br /><br />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={this.props.classes.submit}
                  >
                    Search
                  </Button>
                </form>
              </Paper>
            </main>
          );
        }
    }

Filter.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  let mapStateToProps = function(state) {
    return {
      lat: state.lat,
      lng: state.lng,
      newSearch: state.newSearch,
      restos: state.restos
    };
  };
  
  
  let connectFilter = connect(mapStateToProps)(Filter);
  
  export default  compose(withStyles(styles))(withRouter(connectFilter));
    

