"""
Test Different Base Models to Find One That Works for Telugu
Run this BEFORE attempting to fine-tune
"""
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import warnings
warnings.filterwarnings('ignore')

# Test Telugu text
TELUGU_TEST = "తెలంగాణ రాష్ట్రంలో వ్యవసాయ రంగం అభివృద్ధికి ప్రభుత్వం కొత్త పథకాలు ప్రకటించింది."

# Models to test (in order of preference)
MODELS_TO_TEST = [
    "ai4bharat/IndicBART",
    "facebook/mbart-large-50-many-to-many-mmt",
    "google/mt5-base",
    "csebuetnlp/mT5_multilingual_XLSum",
]

print("="*80)
print("🔍 TESTING BASE MODELS FOR TELUGU SUPPORT")
print("="*80)
print(f"\nTest input: {TELUGU_TEST}\n")

working_models = []

for model_name in MODELS_TO_TEST:
    print(f"\n{'='*80}")
    print(f"Testing: {model_name}")
    print(f"{'='*80}")
    
    try:
        # Load model
        print("Loading tokenizer...", end=" ")
        tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
        print("✅")
        
        print("Loading model...", end=" ")
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        model.eval()
        print("✅")
        
        print(f"Vocab size: {len(tokenizer)}")
        
        # Check for language tokens
        vocab = tokenizer.get_vocab()
        lang_tokens = [t for t in vocab.keys() if any(x in t for x in ['<te>', 'te_IN', '▁te'])]
        if lang_tokens:
            print(f"Language tokens found: {lang_tokens[:5]}")
        
        # Test generation
        print("\nTesting generation...")
        
        # Try with and without language token prefix
        test_variants = [
            TELUGU_TEST,  # Raw text
            f"<te> {TELUGU_TEST}",  # With <te>
            f"translate Telugu to Telugu: {TELUGU_TEST}",  # mT5 style
        ]
        
        best_output = None
        best_variant = None
        
        for variant in test_variants:
            try:
                inputs = tokenizer(variant, return_tensors="pt", truncation=True, max_length=512)
                
                with torch.no_grad():
                    outputs = model.generate(
                        **inputs,
                        max_length=100,
                        num_beams=4,
                        early_stopping=True
                    )
                
                result = tokenizer.decode(outputs[0], skip_special_tokens=True)
                
                # Check if output is valid
                if (len(result) > 10 and 
                    not result.startswith("<") and 
                    not result == variant and
                    any('\u0C00' <= c <= '\u0C7F' for c in result)):  # Contains Telugu chars
                    
                    best_output = result
                    best_variant = variant
                    break
                    
            except Exception as e:
                continue
        
        if best_output:
            print(f"\n✅ SUCCESS!")
            print(f"   Input variant: {best_variant[:50]}...")
            print(f"   Output: {best_output}")
            print(f"   Output length: {len(best_output)} chars")
            
            # Verify it's actually Telugu
            telugu_chars = sum(1 for c in best_output if '\u0C00' <= c <= '\u0C7F')
            print(f"   Telugu characters: {telugu_chars}/{len(best_output)}")
            
            working_models.append({
                'name': model_name,
                'input_format': best_variant,
                'output_sample': best_output,
                'vocab_size': len(tokenizer)
            })
            print(f"\n   ⭐ This model WORKS for Telugu!")
            
        else:
            print(f"\n❌ FAILED - Output is garbage or empty")
            print("   This model cannot generate Telugu properly")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)[:100]}")
        continue

# Summary
print("\n" + "="*80)
print("📊 SUMMARY")
print("="*80)

if working_models:
    print(f"\n✅ Found {len(working_models)} working model(s):\n")
    
    for i, m in enumerate(working_models, 1):
        print(f"{i}. {m['name']}")
        print(f"   Vocab size: {m['vocab_size']}")
        print(f"   Input format: {m['input_format'][:60]}...")
        print(f"   Output: {m['output_sample'][:60]}...")
        print()
    
    print("="*80)
    print("🎯 RECOMMENDATION")
    print("="*80)
    print(f"\nUse this model for fine-tuning: {working_models[0]['name']}")
    print(f"\nIn your training script, use:")
    print(f'MODEL_NAME = "{working_models[0]["name"]}"')
    
    # Check if needs language token
    if '<te>' in working_models[0]['input_format']:
        print(f'\nAdd language token in preprocessing:')
        print(f'inputs = ["<te> " + text for text in examples["article"]]')
    else:
        print(f'\nNo language token needed - use raw text:')
        print(f'inputs = examples["article"]')
    
else:
    print("\n❌ NO WORKING MODELS FOUND!")
    print("\nPossible issues:")
    print("1. Internet connection problems")
    print("2. Hugging Face token needed")
    print("3. PyTorch/Transformers version incompatible")
    print("\nTry:")
    print("- pip install --upgrade transformers torch")
    print("- Set HF_TOKEN environment variable")
    print("- Check your internet connection")

print("\n" + "="*80)