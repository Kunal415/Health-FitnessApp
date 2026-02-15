import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const NutritionTracker = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [numMeals, setNumMeals] = useState(3);
    const [meals, setMeals] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    // Step 1: Initialize Meals
    const handleNumMealsSubmit = (e) => {
        e.preventDefault();
        const initialMeals = Array.from({ length: numMeals }, (_, i) => ({
            name: `Meal ${i + 1}`,
            items: [{ name: '', quantity: 1 }] // Start with 1 empty item
        }));
        setMeals(initialMeals);
        setStep(2);
    };

    // Step 2: Manage Meal Content
    const handleItemChange = (mealIndex, itemIndex, field, value) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items[itemIndex][field] = value;
        setMeals(updatedMeals);
    };

    const addItemToMeal = (mealIndex) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items.push({ name: '', quantity: 1 });
        setMeals(updatedMeals);
    };

    const removeItemFromMeal = (mealIndex, itemIndex) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items.splice(itemIndex, 1);
        setMeals(updatedMeals);
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // Filter out empty items
            const cleanedMeals = meals.map(meal => ({
                ...meal,
                items: meal.items.filter(item => item.name.trim() !== '')
            })).filter(meal => meal.items.length > 0);

            const { data } = await api.post('/nutrition/calculate', { meals: cleanedMeals });
            setAnalysis(data);
            setStep(3);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to calculate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(1);
        setAnalysis(null);
        setMeals([]);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px' }}>

                    {step === 1 && (
                        <div className="glass-panel animate-fade-in" style={{ textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '2rem' }}>How many meals do you eat per day?</h2>
                            <form onSubmit={handleNumMealsSubmit}>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setNumMeals(Math.max(1, numMeals - 1))}>-</button>
                                    <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem' }}>{numMeals}</span>
                                    <button type="button" className="btn btn-outline" onClick={() => setNumMeals(Math.min(10, numMeals + 1))}>+</button>
                                </div>
                                <button type="submit" className="btn btn-primary">Next: Enter Foods</button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>What's in your meals?</h2>
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter food name (e.g. "Chicken breast") and approx servings.</p>

                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {meals.map((meal, mIndex) => (
                                    <div key={mIndex} className="glass-panel">
                                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{meal.name}</h3>
                                        {meal.items.map((item, iIndex) => (
                                            <div key={iIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                                <input
                                                    placeholder="Food Item (e.g. Rice)"
                                                    value={item.name}
                                                    onChange={e => handleItemChange(mIndex, iIndex, 'name', e.target.value)}
                                                    style={{ flex: 2 }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={e => handleItemChange(mIndex, iIndex, 'quantity', parseFloat(e.target.value) || 1)}
                                                    style={{ flex: 0.5, minWidth: '60px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => removeItemFromMeal(mIndex, iIndex)}
                                                    style={{ padding: '0.5rem' }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={() => addItemToMeal(mIndex)}
                                            style={{ marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                        >
                                            + Add Item
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}>
                                    {loading ? 'Calculating...' : 'Calculate Nutrition'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && analysis && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Nutrition Analysis</h2>

                            {/* Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--primary)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Calories</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(analysis.calories)}</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Protein</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#818cf8' }}>{Math.round(analysis.protein)}g</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Carbs</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#facc15' }}>{Math.round(analysis.carbs)}g</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fat</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fca5a5' }}>{Math.round(analysis.fat)}g</div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            {analysis.suggestions && analysis.suggestions.length > 0 && (
                                <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #facc15' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>Suggestions</h3>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {analysis.suggestions.map((s, i) => (
                                            <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Breakdown */}
                            <h3 style={{ marginBottom: '1rem' }}>Meal Breakdown</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {analysis.meals.map((meal, i) => (
                                    <div key={i} className="glass-panel">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h4>{meal.name}</h4>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(meal.calories)} cal</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                            <span>P: {Math.round(meal.protein)}g</span>
                                            <span>C: {Math.round(meal.carbs)}g</span>
                                            <span>F: {Math.round(meal.fat)}g</span>
                                        </div>
                                        <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
                                            {meal.items.map((item, j) => (
                                                <li key={j}>
                                                    {item.quantity}x {item.name}: {Math.round(item.calories)} cal
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <button className="btn btn-primary" onClick={reset}>Calculate Another Day</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionTracker;
